import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AccountLog } from 'src/app/demo/api/accountLogs';
import { ObjectName } from 'src/app/demo/api/objectName';
import { MovementType } from 'src/app/demo/data/enum/movementType';
import { AccountLogFilters, AccountLogService } from 'src/app/demo/service/queries/accountLogService';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { exportAccountLogsExcel, exportAccountLogsPdf } from 'src/app/demo/service/queries/accountLogExport';

@Component({
  templateUrl: './list-account-logs.component.html',
  providers: [MessageService]
})
export class ListAccountLogsComponent {

  balance: number = 0;

  accountNames!: ObjectName[];
  selectedAccount!: number;
  private selectedAccountName: string = '';

  loading: boolean = false;
  exporting: boolean = false;
  totalRecords: number = 0;
  accountLogs: AccountLog[] = [];

  currentPage: number = 0;
  pageSize: number = 20;

  MovementType: any = MovementType;
  private filters: AccountLogFilters = {};

  constructor(
    private accountService: AccountService,
    private accountLogService: AccountLogService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.accountService.getBankAccountNames().subscribe((accountNames) => {
      this.accountNames = accountNames;
    });
  }

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
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.filters = this.buildFilters(event.filters);

    if (this.selectedAccount != null) {
      this.loadAccountLogs();
    }
  }

  changeValue(event: any) {
    this.selectedAccount = event.value.objectId;
    this.selectedAccountName = event.value.name;
    this.currentPage = 0;

    this.loadAccountLogs();
  }

  private loadAccountLogs() {
    this.loading = true;

    this.accountLogService.getAccountLogs(this.selectedAccount, this.currentPage, this.pageSize, this.filters).subscribe((accountLogs) => {
      this.accountLogs = accountLogs.objectList;
      this.totalRecords = accountLogs.totalElements;

      // The list comes newest-first, so the first row on page 0 holds the balance at the end of the filtered period.
      if (this.currentPage === 0) {
        this.balance = this.accountLogs.length > 0 ? this.accountLogs[0].balance : 0;
      }

      this.loading = false;
    });
  }

  export(format: 'pdf' | 'excel') {
    if (this.selectedAccount == null) {
      this.messageService.add({ severity: 'warn', summary: 'Conta', detail: 'Selecione uma conta para exportar.' });
      return;
    }

    this.exporting = true;
    this.accountLogService.exportAccountLogs(this.selectedAccount, this.filters).subscribe({
      next: async (result) => {
        const data = {
          title: `Mapa Banco - ${this.selectedAccountName}`,
          fileName: `mapa-banco-${this.selectedAccountName}`.replace(/\s+/g, '-').toLowerCase(),
          dateFrom: this.filters.dateFrom,
          dateTo: this.filters.dateTo,
          logs: result,
        };
        if (format === 'pdf') exportAccountLogsPdf(data);
        else await exportAccountLogsExcel(data);
        this.exporting = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível exportar o mapa banco.' });
        this.exporting = false;
      }
    });
  }

  getBalanceColor(balance: number): string {
    if (balance > 0) {
      return 'var(--green-600)';
    } else if (balance < 0) {
      return 'var(--red-600)';
    } else {
      return 'black';
    }
  }
}
