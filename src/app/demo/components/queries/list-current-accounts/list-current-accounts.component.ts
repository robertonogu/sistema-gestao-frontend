import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentAccountLog } from 'src/app/demo/api/currentAccountLog';
import { Origin } from 'src/app/demo/api/origin';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { CurrentAccountLogFilters, CurrentAccountLogService } from 'src/app/demo/service/queries/currentAccountLogService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { euros, exportStatementPdf, periodLabel } from 'src/app/demo/service/statementPdf';
import { parseLocalDate } from 'src/app/demo/service/localDate.interceptor';

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
  exporting: boolean = false;

  // Período por omissão: o ano corrente (um filtro guardado na sessão sobrepõe-se a este)
  private readonly currentYear = new Date().getFullYear();
  defaultFilters: any = {
    date: [{ value: [new Date(this.currentYear, 0, 1), new Date(this.currentYear, 11, 31)], matchMode: 'equals', operator: 'and' }]
  };

  constructor(
    private originService: OriginService,
    private currentAccountLogService: CurrentAccountLogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Vindo da página Saldos: abre logo o extrato dessa origem (a tabela carrega-o ao iniciar)
    const originId = Number(this.route.snapshot.queryParamMap.get('originId'));
    if (originId) this.selectedOrigin = originId;

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

  private get selectedOriginName(): string {
    for (const group of this.origins ?? []) {
      const item = group.items.find(origin => origin.value === this.selectedOrigin);
      if (item) return item.label.trim();
    }
    return '';
  }

  // Extrato em PDF de todos os registos filtrados, com os totais no fim
  exportPdf() {
    if (this.selectedOrigin == null) return;
    this.exporting = true;

    this.currentAccountLogService.exportCurrentAccountLogs(this.selectedOrigin, this.filters).subscribe({
      next: (result) => {
        const logs = result.objectList;
        const dates = logs.map(log => parseLocalDate(log.date as any));
        const totalCredit = logs.reduce((sum, log) => sum + log.credit, 0);
        const totalDebt = logs.reduce((sum, log) => sum + log.debt, 0);
        const balance = logs.length > 0 ? logs[logs.length - 1].balance : 0;

        exportStatementPdf({
          title: `Extrato da Conta Corrente de ${this.selectedOriginName}`,
          period: periodLabel(dates),
          head: ['Data', 'Nº Documento', 'Método de Pagamento', 'Descrição', 'Crédito', 'Débito', 'Saldo'],
          body: logs.map((log, i) => [
            dates[i]?.toLocaleDateString('pt-PT') ?? '',
            log.documentNumber ?? '',
            log.paymentMethod ? (this.PaymentMethod[log.paymentMethod] ?? log.paymentMethod) : '',
            log.description ?? '',
            log.credit !== 0 || log.debt === 0 ? euros(log.credit) : '',
            log.debt !== 0 ? euros(log.debt) : '',
            euros(log.balance)
          ]),
          foot: [['Total', '', '', '', euros(totalCredit), euros(totalDebt), euros(balance)]],
          rightAlignedColumns: [4, 5, 6],
          fileName: ('extrato-conta-corrente-' + this.selectedOriginName).replace(/\s+/g, '-').toLowerCase()
        });
        this.exporting = false;
      },
      error: () => this.exporting = false
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
