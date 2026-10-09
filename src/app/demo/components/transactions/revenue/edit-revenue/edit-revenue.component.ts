import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AccountName } from 'src/app/demo/api/accountName';
import { Origin } from 'src/app/demo/api/origin';
import { SaleForRevenue } from 'src/app/demo/api/saleForRevenue';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { RevenueType } from 'src/app/demo/data/enum/revenueType';
import { RevenueCreation } from 'src/app/demo/data/model/revenueCreation.model';
import { RevenueSaleLine, RevenueSalesSelection } from 'src/app/demo/data/model/revenueSalesSelection';
import { AccountService, CASH_PAYMENT_METHOD_KEY, getPaymentMethodEntries } from 'src/app/demo/service/company/accountService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { RevenueService } from 'src/app/demo/service/transactions/revenueService';
import { SaleService } from 'src/app/demo/service/transactions/saleService';

@Component({
  templateUrl: './edit-revenue.component.html',
  providers: [MessageService]
})
export class EditRevenueComponent implements OnInit {

  revenueTypes = RevenueType;
  origins!: Origin[];
  accountNames!: AccountName[];
  paymentMethods = PaymentMethod;
  validIvaRates!: number[];
  salesSelection = new RevenueSalesSelection();

  loading = true;
  revenueId!: number;

  date!: Date;
  selectedRevenueType!: RevenueType;
  documentNumber!: string;
  selectedOrigin!: number;
  selectedAccount!: number;
  selectedPaymentMethod!: PaymentMethod;
  iva!: number;
  totalValue!: number;

  revenue!: RevenueCreation;

  constructor(
    private originService: OriginService,
    private accountService: AccountService,
    private saleService: SaleService,
    private messageService: MessageService,
    private revenueService: RevenueService,
    private route: ActivatedRoute,
    private _location: Location
  ) {
    this.validIvaRates = [0, 6, 13, 23];
  }

  get isSalesRevenueType(): boolean {
    return (this.selectedRevenueType as unknown as string) === 'SALES';
  }

  ngOnInit(): void {
    this.revenueId = Number(this.route.snapshot.params['revenueId']);

    this.accountService.getAccountNamesWithType().subscribe((accountNames) => {
      this.accountNames = accountNames;
      this.refreshPaymentMethodOptions();
    });

    this.originService.getOriginsGrouped().subscribe((origins) => {
      this.origins = origins;

      this.revenueService.getRevenue(this.revenueId).subscribe({
        next: (revenue) => {
          this.date = new Date(revenue.date);
          this.selectedRevenueType = revenue.revenueType;
          this.documentNumber = revenue.documentNumber;
          this.selectedOrigin = revenue.originId;
          this.selectedAccount = revenue.accountId;
          this.selectedPaymentMethod = revenue.paymentMethod;
          this.totalValue = revenue.totalValue;
          this.iva = revenue.netValue > 0 ? Math.round((revenue.iva / revenue.netValue) * 100) : 0;
          this.refreshPaymentMethodOptions();
          this.getSalesForClient(revenue.sales ?? []);

          this.loading = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar a receita.' });
          this.loading = false;
        }
      });
    });
  }

  back() {
    this._location.back();
  }

  isCashAccountSelected: boolean = false;
  paymentMethodOptions: { key: string; value: string }[] = getPaymentMethodEntries(undefined);

  private get selectedAccountObj(): AccountName | undefined {
    return this.accountNames?.find(account => account.objectId === this.selectedAccount);
  }

  private refreshPaymentMethodOptions(): void {
    const cashBox = this.selectedAccountObj?.cashBox;
    this.isCashAccountSelected = !!cashBox;
    this.paymentMethodOptions = getPaymentMethodEntries(cashBox);
  }

  onAccountChange() {
    this.refreshPaymentMethodOptions();
    if (this.isCashAccountSelected) {
      this.selectedPaymentMethod = CASH_PAYMENT_METHOD_KEY;
    } else if ((this.selectedPaymentMethod as unknown as string) === 'CASH') {
      this.selectedPaymentMethod = undefined as any;
    }
  }

  private isSelectedOriginAClient(): boolean {
    const clientsCategory = this.origins.find(originItem => originItem.label === 'Clientes');
    return !!clientsCategory && clientsCategory.items.some(item => item.value === this.selectedOrigin);
  }

  getSalesForClient(lines: RevenueSaleLine[] = []) {
    this.salesSelection.clear();

    if (this.isSalesRevenueType && this.isSelectedOriginAClient()) {
      this.saleService.getSalesPendingForRevenue(this.selectedOrigin, this.revenueId).subscribe((sales) => {
        this.salesSelection.load(sales, lines);
        if (lines.length > 0) this.iva = this.salesSelection.commonIvaRate ?? this.iva;
      });
    }
  }

  onOriginChange() {
    this.getSalesForClient();
  }

  onRevenueTypeChange() {
    this.getSalesForClient();
  }

  // ---- Vendas liquidadas pela receita (várias, como as faturas num pagamento) ----
  onSaleSelect(sale: SaleForRevenue) {
    this.salesSelection.onSelect(sale);
    this.syncTotalsFromSales();
  }

  onSaleUnselect(sale: SaleForRevenue) {
    this.salesSelection.onUnselect(sale);
    this.syncTotalsFromSales();
  }

  onSelectAllSales(checked: boolean) {
    this.salesSelection.selectAll(checked);
    this.syncTotalsFromSales();
  }

  onSaleValueChange() {
    this.salesSelection.updateTotal();
    this.syncTotalsFromSales();
  }

  // O Valor Total, numa receita de vendas com vendas pendentes, é repartido pelas vendas da mais antiga para a mais recente
  onTotalInput(value: number | string | null) {
    if (!this.isSalesRevenueType || this.salesSelection.sales.length === 0) return;
    this.salesSelection.distribute(value);
    this.iva = this.salesSelection.commonIvaRate as number;
  }

  private syncTotalsFromSales() {
    this.totalValue = this.salesSelection.total;
    this.iva = this.salesSelection.commonIvaRate as number;
  }

  // Valor recebido a mais do que o distribuído pelas vendas: fica como crédito do cliente na conta corrente
  get revenueExcess(): number {
    return Math.max(0, Math.round(((this.totalValue ?? 0) - this.salesSelection.total) * 100) / 100);
  }

  private buildSaleLines(): RevenueSaleLine[] | null {
    if (!this.isSalesRevenueType) return [];
    const { lines, error } = this.salesSelection.lines();
    if (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error });
      return null;
    }
    if (lines.length > 0 && (this.totalValue ?? 0) + 0.005 < this.salesSelection.total) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O valor total é inferior ao valor distribuído pelas vendas.' });
      return null;
    }
    return lines;
  }

  saveRevenue() {
    const saleLines = this.buildSaleLines();
    if (saleLines === null) return;
    this.revenue = new RevenueCreation(this.date, this.selectedRevenueType, this.documentNumber, this.selectedOrigin, this.selectedAccount, this.selectedPaymentMethod, this.totalValue, this.iva, 0, saleLines);

    if (this.revenue != null) {
      this.revenueService.updateRevenue(this.revenueId, this.revenue).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Receita atualizada com sucesso.' });
        },
        error: (err) => {
          const detail = err?.error?.message || 'Existem campos por preencher.';
          this.messageService.add({ severity: 'error', summary: 'Erro', detail });
        }
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
