import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Sale } from 'src/app/demo/api/sale';
import { SaleService } from 'src/app/demo/service/transactions/saleService';
import { ClientService } from 'src/app/demo/service/company/clientService';
import { ItemName } from 'src/app/demo/api/itemName';

@Component({
  templateUrl: './list-sales.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListSalesComponent implements OnInit {

  loading: boolean = true;
  totalRecords: number = 0;
  sales!: Sale[];

  currentPage: number = 0;
  pageSize: number = 20;

  clientNames: ItemName[] = [];
  netValue: number = 0;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private saleService: SaleService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.clientService.getClientNames().subscribe((clients) => {
      this.clientNames = clients;
    });
  }

  private filterValue(filters: any, field: string) {
    const meta = Array.isArray(filters?.[field]) ? filters[field][0] : filters?.[field];
    return meta?.value ?? undefined;
  }

  // O filtro de data é um calendário de intervalo: um dia escolhido filtra esse dia, dois dias filtram o período
  private dateRange(filters: any): { dateFrom?: Date; dateTo?: Date } {
    const range = this.filterValue(filters, 'date');
    if (Array.isArray(range) && range[0]) {
      return { dateFrom: range[0], dateTo: range[1] ?? range[0] };
    }
    return {};
  }

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    const { dateFrom, dateTo } = this.dateRange(event.filters);
    const clientId = this.filterValue(event.filters, 'client');

    this.saleService.getSales(this.currentPage, this.pageSize, dateFrom, dateTo, clientId).subscribe((sales) => {
      this.sales = sales.objectList;
      this.totalRecords = sales.totalElements;
      this.netValue = sales.netValue;
      this.loading = false;
    });
  }


  newSale() {
    this.router.navigate(['./transactions/sales/create-sale']);
  }

  editSale(sale: Sale) {
    this.router.navigate(['./transactions/sales/edit-sale', sale.saleId]);
  }

  deleteSale(sale: Sale) {
    this.confirmationService.confirm({
      header: `Tem a certeza que pretende apagar a venda com o número ${sale.documentNumber}?`,
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.saleService.deleteSale(sale.saleId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda eliminada com sucesso.' });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
