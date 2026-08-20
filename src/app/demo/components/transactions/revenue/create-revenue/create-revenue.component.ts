import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ObjectName } from 'src/app/demo/api/objectName';
import { Origin } from 'src/app/demo/api/origin';
import { SaleForRevenue } from 'src/app/demo/api/saleForRevenue';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { RevenueType } from 'src/app/demo/data/enum/revenueType';
import { RevenueCreation } from 'src/app/demo/data/model/revenueCreation.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
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
  accountNames!: ObjectName[];
  paymentMethods = PaymentMethod;
  validIvaRates!: number[];
  sales: SaleForRevenue[] = [];

  date!: Date;
  selectedRevenueType!: RevenueType;
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

    this.accountService.getAccountNames().subscribe((accountNames) => {
      this.accountNames = accountNames;
    });
  }

  back() {
    this._location.back();
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
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher' });
    }
  }
}
