import { Component, OnInit } from '@angular/core';
import { CurrentAccountLog } from 'src/app/demo/api/currentAccountLog';
import { Origin } from 'src/app/demo/api/origin';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { CurrentAccountLogFilters, CurrentAccountLogService } from 'src/app/demo/service/queries/currentAccountLogService';
import { OriginService } from 'src/app/demo/service/company/originService';

@Component({
  templateUrl: './list-current-accounts.component.html'
})
export class ListCurrentAccountsComponent implements OnInit {

  origins!: Origin[];
  selectedOrigin!: number;

  balance: number = 0;
  totalCredit: number = 0;
  totalDebt: number = 0;

  loading: boolean = false;
  totalRecords: number = 0;
  currentAccountLogs: CurrentAccountLog[] = [];

  first: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  PaymentMethod: any = PaymentMethod;
  private filters: CurrentAccountLogFilters = {};

  // Período por omissão: o ano corrente (um filtro guardado na sessão sobrepõe-se a este)
  private readonly currentYear = new Date().getFullYear();
  defaultFilters: any = {
    date: [{ value: [new Date(this.currentYear, 0, 1), new Date(this.currentYear, 11, 31)], matchMode: 'equals', operator: 'and' }]
  };

  constructor(
    private originService: OriginService,
    private currentAccountLogService: CurrentAccountLogService
  ) {}

  ngOnInit(): void {
    this.originService.getOriginsGrouped().subscribe((origins) => {
      this.origins = origins;
    });
  }

  private filterValue(filters: any, field: string) {
    const meta = Array.isArray(filters?.[field]) ? filters[field][0] : filters?.[field];
    return meta?.value ?? undefined;
  }

  // O filtro de data é um calendário de intervalo: um dia escolhido filtra esse dia, dois dias filtram o período
  private buildFilters(filters: any): CurrentAccountLogFilters {
    const dateRange = this.filterValue(filters, 'date');
    if (Array.isArray(dateRange) && dateRange[0]) {
      return { dateFrom: dateRange[0], dateTo: dateRange[1] ?? dateRange[0] };
    }
    return {};
  }

  nextPage(event: any) {
    this.first = event.first;
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.filters = this.buildFilters(event.filters);
    this.load();
  }

  changeValue(event: any) {
    this.selectedOrigin = event.value;
    this.first = 0;
    this.currentPage = 0;
    this.load();
  }

  private load() {
    if (this.selectedOrigin == null) return;

    this.loading = true;
    this.currentAccountLogService.getCurrentAccountLogs(this.currentPage, this.pageSize, this.selectedOrigin, this.filters).subscribe((currentAccountLogs) => {
      this.currentAccountLogs = currentAccountLogs.objectList;
      this.totalRecords = currentAccountLogs.totalElements;
      // Totais e saldo de todos os registos filtrados (não só desta página)
      this.totalCredit = currentAccountLogs.totalCredit;
      this.totalDebt = currentAccountLogs.totalDebt;
      this.balance = currentAccountLogs.balance;
      this.loading = false;
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
