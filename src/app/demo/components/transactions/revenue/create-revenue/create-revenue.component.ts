import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ObjectName } from 'src/app/demo/api/objectName';
import { Origin } from 'src/app/demo/api/origin';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { RevenueType } from 'src/app/demo/data/enum/revenueType';
import { RevenueCreation } from 'src/app/demo/data/model/revenueCreation.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { RevenueService } from 'src/app/demo/service/transactions/revenueService';

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
  constructionNames!: ConstructionNames[];

  date!: Date;
  selectedRevenueType!: RevenueType;
  documentNumber!: string
  selectedOrigin!: number;
  selectedAccount!: number;
  selectedPaymentMethod!: PaymentMethod;
  value!: number;
  iva!: number;
  totalValue!: number;
  selectedConstruction!: number;

  revenue!: RevenueCreation;

  constructor(
    private originService: OriginService, 
    private accountService: AccountService, 
    private constructionService: ConstructionService, 
    private messageService: MessageService,
    private revenueService: RevenueService,
    private _location: Location
  ) {
    this.validIvaRates = [0, 6, 13, 23];
  }

  ngOnInit(): void {
    this.originService.getOriginsGrouped().subscribe((origins) => {
      this.origins = origins;
      console.log(this.origins)
    });

    this.accountService.getAccountNames().subscribe((accountNames) => {
      this.accountNames = accountNames;
    });
  }

  back() {
    this._location.back();
  }

  getConstructionNames() {
    this.constructionNames = [];
    const clientsCategory = this.origins.find(originItem => originItem.label === 'Clientes');

    if (clientsCategory && clientsCategory.items.some(item => item.value === this.selectedOrigin)) {
      this.constructionService.getConstructionNamesForClient(this.selectedOrigin).subscribe((constructionNames) => {
        this.constructionNames = constructionNames;
      });
    }
  }

  newRevenue() {
    this.revenue = new RevenueCreation(this.date, this.selectedRevenueType, this.documentNumber, this.selectedOrigin, this.selectedAccount, this.selectedPaymentMethod, this.value, this.iva, this.selectedConstruction);
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
