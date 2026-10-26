import { Location } from '@angular/common';
import { SaleForRevenue } from 'src/app/demo/api/saleForRevenue';
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


  // ---- Nota de crédito ao cliente: valores indicados positivos e guardados negativos ----
  creditNote: boolean = false;
  creditedSaleId: number | null = null;
  creditableSales: (SaleForRevenue & { label: string })[] = [];

  onCreditNoteChange(): void {
    if (!this.creditNote) this.creditedSaleId = null;
    this.loadCreditableSales();
  }

  loadCreditableSales(): void {
    if (!this.creditNote || !this.selectedClient) {
      this.creditableSales = [];
      return;
    }
    this.saleService.getCreditableSales(this.selectedClient).subscribe(sales =>
      this.creditableSales = sales.map(sale => ({
        ...sale,
        label: sale.documentNumber
      })));
  }

  // A nota de crédito fica com a obra, a taxa de IVA e o valor sem IVA da venda creditada
  // (o valor pode ser alterado, p.ex. para creditar só uma parte)
  onCreditedSaleChange(): void {
    const sale = this.creditableSales.find(item => item.saleId === this.creditedSaleId);
    if (!sale) return;
    if (sale.constructionId) this.selectedConstruction = sale.constructionId;
    if (this.validIvaRates.includes(sale.ivaRate)) this.iva = sale.ivaRate;
    if (sale.netValue) this.netValue = sale.netValue;
  }

  back() {
    this._location.back();
  }

  // Numa nota de crédito o total é negativo (abate ao que o cliente deve)
  get totalValue(): number {
    const total = Math.round(((this.netValue || 0) + (this.netValue || 0) * (this.iva || 0) / 100) * 100) / 100;
    return this.creditNote ? -Math.abs(total) : total;
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
    this.loadCreditableSales();
  }

  newSale() {
    this.sale = { date: this.date, clientId: this.selectedClient, documentNumber: this.documentNumber, constructionId: this.selectedConstruction, netValue: this.netValue, iva: this.iva,
      creditNote: this.creditNote, creditedSaleId: this.creditNote ? this.creditedSaleId : null } as SaleCreation;

    if (this.sale != null) {
      this.saleService.createSale(this.sale).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda adicionada com sucesso.' });
          this.resetForm();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message ?? 'Não foi possível adicionar a venda.' });
        }
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
    this.creditNote = false;
    this.creditedSaleId = null;
    this.creditableSales = [];
  }
}
