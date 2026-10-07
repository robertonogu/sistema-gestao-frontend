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

  loading: boolean = false;
  totalRecords: number = 0;
  currentAccountLogs: CurrentAccountLog[] = [];

  first: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  PaymentMethod: any = PaymentMethod;
  private filters: CurrentAccountLogFilters = {};

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
      // A lista vem dos mais recentes para os mais antigos: a primeira linha da página 0 tem o saldo no fim do período
      if (this.currentPage === 0) {
        this.balance = this.currentAccountLogs[0]?.balance ?? 0;
      }
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
