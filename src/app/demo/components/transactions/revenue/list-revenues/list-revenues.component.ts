import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Revenue } from 'src/app/demo/api/revenue';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { RevenueType } from 'src/app/demo/data/enum/revenueType';
import { RevenueService } from 'src/app/demo/service/transactions/revenueService';

@Component({
  templateUrl: './list-revenues.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListRevenuesComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  revenues!: Revenue[];

  currentPage: number = 0;
  pageSize: number = 20;

  totalValue: number = 0;

  RevenueType: any = RevenueType;
  PaymentMethod = PaymentMethod;

  constructor(
    private revenueService: RevenueService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

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

    this.revenueService.getRevenues(this.currentPage, this.pageSize, dateFrom, dateTo).subscribe((revenues) => {
      this.revenues = revenues.revenueList;
      this.totalRecords = revenues.totalElements;
      this.totalValue = revenues.totalValue;
      this.loading = false;
    });
  }

  newRevenue() {
    this.router.navigate(['./transactions/revenues/create-revenue']);
  }

  deleteRevenue(revenue: Revenue) {
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar a receita ' + (revenue.documentNumber ?? '') + '?',
      message: 'Os lançamentos na conta corrente e na conta (banco/caixa) também são removidos.',
      accept: () => {
        this.revenueService.deleteRevenue(revenue.revenueId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Receita eliminada com sucesso.' });
            this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível eliminar a receita.' })
        });
      }
    });
  }

  editRevenue(revenue: Revenue) {
    this.router.navigate(['./transactions/revenues/edit-revenue', revenue.revenueId]);
  }

}
