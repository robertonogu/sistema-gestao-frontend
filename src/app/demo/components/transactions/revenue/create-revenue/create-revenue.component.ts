import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AccountName } from 'src/app/demo/api/accountName';
import { Origin } from 'src/app/demo/api/origin';
import { SaleForRevenue } from 'src/app/demo/api/saleForRevenue';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { RevenueType } from 'src/app/demo/data/enum/revenueType';
import { RevenueCreation } from 'src/app/demo/data/model/revenueCreation.model';
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
  sales: SaleForRevenue[] = [];

  private readonly defaultRevenueType = 'SALES' as unknown as RevenueType;

  date!: Date;
  selectedRevenueType: RevenueType = this.defaultRevenueType;
  documentNumber!: string
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
    private _location: Location
  ) {
    this.validIvaRates = [0, 6, 13, 23];
  }

  get isSalesRevenueType(): boolean {
    return (this.selectedRevenueType as unknown as string) === 'SALES';
  }

  ngOnInit(): void {
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
      this.saleService.getSalesPendingForRevenue(this.selectedOrigin).subscribe((sales) => {
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

  newRevenue() {
    this.revenue = new RevenueCreation(this.date, this.selectedRevenueType, this.documentNumber, this.selectedOrigin, this.selectedAccount, this.selectedPaymentMethod, this.totalValue, this.iva, this.selectedSale);
    console.log(this.revenue);
    if (this.revenue != null) {
      this.revenueService.createRevenue(this.revenue).subscribe(newRevenue => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Receita adicionada com sucesso.' });
        this.resetForm();
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
    this.iva = undefined as any;
    this.totalValue = undefined as any;
    this.selectedSale = undefined as any;
    this.sales = [];
  }
}
