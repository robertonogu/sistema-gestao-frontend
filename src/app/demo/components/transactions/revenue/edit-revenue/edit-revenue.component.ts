import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AccountName } from 'src/app/demo/api/accountName';
import { Origin } from 'src/app/demo/api/origin';
import { SaleForRevenue } from 'src/app/demo/api/saleForRevenue';
import { CASH_PAYMENT_METHOD_KEY, getPaymentMethodEntries, PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { RevenueType } from 'src/app/demo/data/enum/revenueType';
import { RevenueCreation } from 'src/app/demo/data/model/revenueCreation.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
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
  sales: SaleForRevenue[] = [];

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
  selectedSale!: number;

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
          this.selectedSale = revenue.saleId ?? (undefined as any);

          this.getSalesForClient();

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

  get selectedAccountObj(): AccountName | undefined {
    return this.accountNames?.find(account => account.objectId === this.selectedAccount);
  }

  get isCashAccountSelected(): boolean {
    return !!this.selectedAccountObj?.cashBox;
  }

  get paymentMethodOptions(): { key: string; value: string }[] {
    return getPaymentMethodEntries(this.selectedAccountObj?.cashBox);
  }

  onAccountChange() {
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

  getSalesForClient() {
    this.sales = [];

    if (this.isSalesRevenueType && this.isSelectedOriginAClient()) {
      this.saleService.getSalesPendingForRevenue(this.selectedOrigin, this.revenueId).subscribe((sales) => {
        this.sales = sales;
      });
    }
  }

  onOriginChange() {
    this.getSalesForClient();
  }

  onRevenueTypeChange() {
    this.selectedSale = undefined as any;
    this.getSalesForClient();
  }

  onSaleChange() {
    const sale = this.sales.find(s => s.saleId === this.selectedSale);
    if (!sale) return;

    this.iva = sale.ivaRate;
    this.totalValue = sale.pendingValue;
  }

  saveRevenue() {
    this.revenue = new RevenueCreation(this.date, this.selectedRevenueType, this.documentNumber, this.selectedOrigin, this.selectedAccount, this.selectedPaymentMethod, this.totalValue, this.iva, this.selectedSale);

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
