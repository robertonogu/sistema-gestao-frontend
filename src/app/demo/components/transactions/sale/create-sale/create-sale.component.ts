import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { SaleCreation } from 'src/app/demo/api/saleCreation';
import { ClientService } from 'src/app/demo/service/company/clientService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { SaleService } from 'src/app/demo/service/transactions/saleService';

@Component({
  templateUrl: './create-sale.component.html',
  providers: [MessageService]
})
export class CreateSaleComponent {

  clientNames: ItemName[] = [];
  constructionNames: ConstructionNames[] = [];
  validIvaRates: number[];

  date: Date | undefined;
  selectedClient!: number;
  documentNumber: string | undefined;
  selectedConstruction: number | undefined;
  value: number = 0;
  iva: number = 0

  sale: SaleCreation | undefined;

  constructor(
    private clientService: ClientService,
    private constructionService: ConstructionService,
    private _location: Location, 
    private messageService: MessageService,
    private saleService: SaleService) 
  {
    this.validIvaRates = [0, 6, 13, 23];
  }

  ngOnInit(): void {
    this.clientService.getClientNames().subscribe((clientNames) => {
      this.clientNames = clientNames;
    });
  }

  back() {
    this._location.back();
  }

  getConstructions() {
    this.constructionService.getConstructionNamesForClient(this.selectedClient).subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });
  }

  newSale() {
    this.sale = { date: this.date, clientId: this.selectedClient, documentNumber: this.documentNumber, constructionId: this.selectedConstruction, value: this.value, iva: this.iva } as SaleCreation;

    if (this.sale != null) {
      this.saleService.createSale(this.sale).subscribe(newSale => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda adicionada com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
