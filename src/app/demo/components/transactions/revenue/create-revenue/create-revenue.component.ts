import { Location } from '@angular/common';
import { FinancerService } from 'src/app/demo/service/company/financerService';
import { ItemName } from 'src/app/demo/api/itemName';
import { Component } from '@angular/core';
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
  templateUrl: './create-revenue.component.html',
  providers: [MessageService]
})
export class CreateRevenueComponent {

  revenueTypes = RevenueType;
  origins!: Origin[];
  accountNames!: AccountName[];
  paymentMethods = PaymentMethod;
  validIvaRates!: number[];
  salesSelection = new RevenueSalesSelection();

  private readonly defaultRevenueType = 'SALES' as unknown as RevenueType;

  date!: Date;
  selectedRevenueType: RevenueType = this.defaultRevenueType;
  documentNumber!: string
  selectedOrigin!: number;
  selectedAccount!: number;
  selectedPaymentMethod!: PaymentMethod;
  iva!: number;
  totalValue!: number;

  revenue!: RevenueCreation;

  constructor(
    private financerService: FinancerService,
    private originService: OriginService,
    private accountService: AccountService,
    private saleService: SaleService,
    private messageService: MessageService,
    private revenueService: RevenueService,
    private _location: Location
  ) {
    this.validIvaRates = [0, 6, 13, 23];
  }

  // Empréstimo de financiador: a origem só pode ser um financiador e não tem IVA
  lenderNames: ItemName[] = [];

  get isMemberLoan(): boolean {
    return (this.selectedRevenueType as unknown as string) === 'MEMBER_LOAN';
  }

  get originOptions(): Origin[] {
    if (!this.isMemberLoan) return this.origins;
    return [{ label: 'Financiadores', items: this.lenderNames.map(lender => ({ label: lender.name, value: lender.id })) } as unknown as Origin];
  }

  private applyMemberLoanRules() {
    if (!this.isMemberLoan) return;
    this.iva = 0;
    if (this.selectedOrigin && !this.lenderNames.some(lender => lender.id === this.selectedOrigin)) {
      this.selectedOrigin = undefined as any;
    }
  }

  get isSalesRevenueType(): boolean {
    return (this.selectedRevenueType as unknown as string) === 'SALES';
  }

  ngOnInit(): void {
    this.financerService.getFinancerNames().subscribe(names => this.lenderNames = names);
    this.originService.getOriginsGrouped().subscribe((origins) => {
      this.origins = origins;
    });

    this.accountService.getAccountNamesWithType().subscribe((accountNames) => {
      this.accountNames = accountNames;
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
      this.saleService.getSalesPendingForRevenue(this.selectedOrigin).subscribe((sales) => {
        this.salesSelection.load(sales, lines);
        if (lines.length > 0) this.iva = this.salesSelection.commonIvaRate ?? this.iva;
      });
    }
  }

  onOriginChange() {
    this.getSalesForClient();
  }

  onRevenueTypeChange() {
    this.applyMemberLoanRules();
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
    // Devolução ao cliente (linhas a somar 0 ou menos): o valor total tem de ser igual ao das linhas
    if (lines.length > 0 && this.salesSelection.total <= 0 && Math.abs((this.totalValue ?? 0) - this.salesSelection.total) > 0.005) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Numa devolução ao cliente o valor total tem de ser igual ao valor das linhas (' + this.salesSelection.total.toFixed(2) + ' €).' });
      return null;
    }
    if (lines.length > 0 && (this.totalValue ?? 0) + 0.005 < this.salesSelection.total) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O valor total é inferior ao valor distribuído pelas vendas.' });
      return null;
    }
    return lines;
  }

  newRevenue() {
    const saleLines = this.buildSaleLines();
    if (saleLines === null) return;
    this.revenue = new RevenueCreation(this.date, this.selectedRevenueType, this.documentNumber, this.selectedOrigin, this.selectedAccount, this.selectedPaymentMethod, this.totalValue, this.iva, 0, saleLines);
    console.log(this.revenue);
    if (this.revenue != null) {
      this.revenueService.createRevenue(this.revenue).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Receita adicionada com sucesso.' });
          this.resetForm();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível adicionar a receita.' });
        }
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher' });
    }
  }

  private resetForm(): void {
    this.date = undefined as any;
    this.selectedRevenueType = this.defaultRevenueType;
    this.documentNumber = undefined as any;
    this.selectedOrigin = undefined as any;
    this.selectedAccount = undefined as any;
    this.selectedPaymentMethod = undefined as any;
    this.refreshPaymentMethodOptions();
    this.iva = undefined as any;
    this.totalValue = undefined as any;
    this.salesSelection.clear();
  }
}
