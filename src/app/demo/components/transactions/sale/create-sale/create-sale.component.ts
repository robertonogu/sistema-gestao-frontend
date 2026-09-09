import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { SaleCreation } from 'src/app/demo/api/saleCreation';
import { ClientCreation } from 'src/app/demo/data/model/clientCreation.model';
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
  netValue: number = 0;
  iva: number = 0

  sale: SaleCreation | undefined;

  quickAddClientDialogVisible: boolean = false;
  quickAddClientSubmitted: boolean = false;
  quickAddClientName: string | null = null;
  quickAddClientNif: number | null = null;

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

  get totalValue(): number {
    return (this.netValue || 0) + (this.netValue || 0) * (this.iva || 0) / 100;
  }

  openQuickAddClient(): void {
    this.quickAddClientSubmitted = false;
    this.quickAddClientName = null;
    this.quickAddClientNif = null;
    this.quickAddClientDialogVisible = true;
  }

  closeQuickAddClient(): void {
    this.quickAddClientDialogVisible = false;
  }

  saveQuickAddClient(): void {
    this.quickAddClientSubmitted = true;
    if (!this.quickAddClientName?.trim()) return;

    const name = this.quickAddClientName;
    const nif = this.quickAddClientNif as number;

    this.clientService.createClient({ name, nif } as ClientCreation).subscribe(client => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente criado com sucesso.' });
      this.quickAddClientDialogVisible = false;
      this.clientService.getClientNames().subscribe(clientNames => {
        this.clientNames = clientNames;
        this.selectedClient = client.originId;
        this.getConstructions();
      });
    });
  }

  getConstructions() {
    this.constructionService.getConstructionNamesForClient(this.selectedClient).subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });
  }

  newSale() {
    this.sale = { date: this.date, clientId: this.selectedClient, documentNumber: this.documentNumber, constructionId: this.selectedConstruction, netValue: this.netValue, iva: this.iva } as SaleCreation;

    if (this.sale != null) {
      this.saleService.createSale(this.sale).subscribe(newSale => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda adicionada com sucesso.' });
        this.resetForm();
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }

  private resetForm(): void {
    this.date = undefined;
    this.selectedClient = undefined as any;
    this.documentNumber = undefined;
    this.selectedConstruction = undefined;
    this.constructionNames = [];
    this.netValue = 0;
    this.iva = 0;
  }
}
