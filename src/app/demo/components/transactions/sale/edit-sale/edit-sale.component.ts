import { Location } from '@angular/common';
import { SaleForRevenue } from 'src/app/demo/api/saleForRevenue';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { SaleCreation } from 'src/app/demo/api/saleCreation';
import { ClientService } from 'src/app/demo/service/company/clientService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { SaleService } from 'src/app/demo/service/transactions/saleService';

@Component({
  templateUrl: './edit-sale.component.html',
  providers: [MessageService]
})
export class EditSaleComponent implements OnInit {

  clientNames: ItemName[] = [];
  constructionNames: ConstructionNames[] = [];
  validIvaRates: number[];

  loading = true;
  saleId!: number;

  date: Date | undefined;
  selectedClient!: number;
  documentNumber: string | undefined;
  selectedConstruction: number | undefined;
  netValue: number = 0;
  iva: number = 0;

  sale: SaleCreation | undefined;

  constructor(
    private clientService: ClientService,
    private constructionService: ConstructionService,
    private _location: Location,
    private messageService: MessageService,
    private saleService: SaleService,
    private route: ActivatedRoute)
  {
    this.validIvaRates = [0, 6, 13, 23];
  }

  ngOnInit(): void {
    this.saleId = Number(this.route.snapshot.params['saleId']);

    this.clientService.getClientNames().subscribe((clientNames) => {
      this.clientNames = clientNames;
    });

    this.saleService.getSale(this.saleId).subscribe({
      next: (sale) => {
        this.date = new Date(sale.date);
        this.selectedClient = sale.clientId;
        this.documentNumber = sale.documentNumber;
        this.selectedConstruction = sale.constructionId ?? undefined;
        // Numa nota de crédito os valores estão negativos; no formulário indicam-se positivos
        this.creditNote = !!sale.creditNote;
        this.creditedSaleId = sale.creditedSaleId ?? null;
        this.netValue = Math.abs(sale.netValue);
        this.iva = sale.netValue !== 0 ? Math.round((sale.iva / sale.netValue) * 100) : 0;

        if (this.selectedClient) {
          this.getConstructions();
        }

        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar a venda.' });
        this.loading = false;
      }
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

  getConstructions() {
    this.constructionService.getConstructionNamesForClient(this.selectedClient).subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });
    this.loadCreditableSales();
  }

  saveSale() {
    this.sale = { date: this.date, clientId: this.selectedClient, documentNumber: this.documentNumber, constructionId: this.selectedConstruction, netValue: this.netValue, iva: this.iva,
      creditNote: this.creditNote, creditedSaleId: this.creditNote ? this.creditedSaleId : null } as SaleCreation;

    if (this.sale != null) {
      this.saleService.updateSale(this.saleId, this.sale).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda atualizada com sucesso.' });
        },
        error: (err) => {
          const detail = err?.error?.message ?? (typeof err === 'string' ? err : 'Existem campos por preencher.');
          this.messageService.add({ severity: 'error', summary: 'Erro', detail });
        }
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
