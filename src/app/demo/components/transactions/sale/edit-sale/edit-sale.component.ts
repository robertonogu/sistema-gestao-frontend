import { Location } from '@angular/common';
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
        this.netValue = sale.netValue;
        this.iva = sale.netValue > 0 ? Math.round((sale.iva / sale.netValue) * 100) : 0;

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

  back() {
    this._location.back();
  }

  getConstructions() {
    this.constructionService.getConstructionNamesForClient(this.selectedClient).subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });
  }

  saveSale() {
    this.sale = { date: this.date, clientId: this.selectedClient, documentNumber: this.documentNumber, constructionId: this.selectedConstruction, netValue: this.netValue, iva: this.iva } as SaleCreation;

    if (this.sale != null) {
      this.saleService.updateSale(this.saleId, this.sale).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda atualizada com sucesso.' });
        },
        error: (err) => {
          const detail = typeof err === 'string' ? err : 'Existem campos por preencher.';
          this.messageService.add({ severity: 'error', summary: 'Erro', detail });
        }
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
