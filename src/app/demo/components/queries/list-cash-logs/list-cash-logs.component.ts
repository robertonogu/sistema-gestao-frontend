import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AccountLog } from 'src/app/demo/api/accountLogs';
import { MovementType } from 'src/app/demo/data/enum/movementType';
import { AccountLogFilters, AccountLogService } from 'src/app/demo/service/queries/accountLogService';
import { exportAccountLogsExcel, exportAccountLogsPdf } from 'src/app/demo/service/queries/accountLogExport';

@Component({
  templateUrl: './list-cash-logs.component.html',
  providers: [MessageService]
})
export class ListCashLogsComponent {

  balance!: number;

  loading: boolean = true;
  exporting: boolean = false;
  totalRecords: number = 0;
  accountLogs!: AccountLog[];

  currentPage: number = 0;
  pageSize: number = 20;

  MovementType: any = MovementType;
  private filters: AccountLogFilters = {};

  constructor(
    private accountLogService: AccountLogService,
    private messageService: MessageService
  ) {}

  private filterValue(filters: any, field: string) {
    const meta = Array.isArray(filters?.[field]) ? filters[field][0] : filters?.[field];
    return meta?.value ?? undefined;
  }

  private buildFilters(filters: any): AccountLogFilters {
    // The date filter is a range calendar: one picked day filters that day, two days filter the period
    const dateRange = this.filterValue(filters, 'date');
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;
    if (Array.isArray(dateRange) && dateRange[0]) {
      dateFrom = dateRange[0];
      dateTo = dateRange[1] ?? dateRange[0];
    }

    return { movementType: this.filterValue(filters, 'movementType'), dateFrom, dateTo };
  }

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.filters = this.buildFilters(event.filters);

    this.accountLogService.getCashAccountLogs(this.currentPage, this.pageSize, this.filters).subscribe((accountLogs) => {
      this.accountLogs = accountLogs.objectList;
      this.totalRecords = accountLogs.totalElements;
      // The list comes newest-first, so the first row on page 0 holds the balance at the end of the filtered period.
      if (this.currentPage === 0) {
        this.balance = this.accountLogs[0]?.balance ?? 0;
      }
      this.loading = false;
    });
  }

  export(format: 'pdf' | 'excel') {
    this.exporting = true;
    this.accountLogService.exportCashAccountLogs(this.filters).subscribe({
      next: async (result) => {
        const data = {
          title: 'Extrato Caixa',
          fileName: 'extrato-caixa',
          dateFrom: this.filters.dateFrom,
          dateTo: this.filters.dateTo,
          logs: result,
        };
        if (format === 'pdf') exportAccountLogsPdf(data);
        else await exportAccountLogsExcel(data);
        this.exporting = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível exportar o extrato de caixa.' });
        this.exporting = false;
      }
    });
  }

  getBalanceColor(balance: number): string {
    if (balance > 0) {
      return 'var(--green-500)';
    } else if (balance < 0) {
      return 'var(--red-500)';
    } else {
      return 'black';
    }
  }

}
