import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Sale } from 'src/app/demo/api/sale';
import { SaleService } from 'src/app/demo/service/transactions/saleService';

@Component({
  templateUrl: './list-sales.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListSalesComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  sales!: Sale[];

  currentPage: number = 0;
  pageSize: number = 5;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService, 
    private router: Router,
    private saleService: SaleService
  ) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.saleService.getSales(this.currentPage, this.pageSize).subscribe((sales) => {
      this.sales = sales.objectList;
      this.totalRecords = sales.totalElements;
      this.loading = false;
    });
  }

  newSale() {
    this.router.navigate(['./transactions/sales/create-sale']);
  }

  deleteSale(sale: Sale) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.saleService.deleteSale(sale.saleId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda eliminada com sucesso.' });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
