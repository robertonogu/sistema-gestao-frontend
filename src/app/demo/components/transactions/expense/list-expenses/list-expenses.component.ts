import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ExpenseListItem } from 'src/app/demo/api/expenseListItem';
import { ItemName } from 'src/app/demo/api/itemName';
import { DocumentType } from 'src/app/demo/data/enum/documentType';
import { PaymentStatus } from 'src/app/demo/data/enum/paymentStatus';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { ExpenseFilters, ExpenseService } from 'src/app/demo/service/transactions/expense.service';
import { OriginService } from 'src/app/demo/service/company/originService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  templateUrl: 'list-expenses.component.html',
  providers: [ConfirmationService, MessageService],
  styles: [`
    .category-dot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
    }
    .category-dot + .category-dot { margin-left: 4px; }
  `]
})

export class ListExpensesComponent implements OnInit {

  loading: boolean = true;
  exporting: boolean = false;
  totalRecords: number = 0;
  expenses!: ExpenseListItem[];

  DocumentType = DocumentType;
  PaymentStatus: any = PaymentStatus;
  PaymentMethod: any = PaymentMethod;

  currentPage: number = 0;
  pageSize: number = 20;

  @ViewChild('dt') table?: Table;
  originNames: ItemName[] = [];

  readonly categoryMeta: Record<string, { label: string; color: string }> = {
    BANK:          { label: 'Banco',        color: '#3b82f6' },
    TAXES:         { label: 'Impostos',     color: '#ef4444' },
    PEOPLE:        { label: 'Pessoal',      color: '#22c55e' },
    OPERATION:     { label: 'Funcionamento',     color: '#8b5cf6' },
    COMMERCIAL:    { label: 'Comercial',    color: '#ec4899' },
    VEHICLES:      { label: 'Veículos',     color: '#f59e0b' },
    EQUIPMENTS:    { label: 'Equipamentos', color: '#14b8a6' },
    TOOLS:         { label: 'Ferramentas',  color: '#a16207' },
    INVENTORY:     { label: 'Inventário',   color: '#0ea5e9' },
    CONSTRUCTIONS: { label: 'Obras',        color: '#64748b' },
  };

  readonly categoryOptions = Object.entries(this.categoryMeta).map(([key, meta]) => ({ key, label: meta.label }));

  categoryLabel(code: string): string {
    return this.categoryMeta[code]?.label ?? code;
  }

  categoryColor(code: string): string {
    return this.categoryMeta[code]?.color ?? '#9ca3af';
  }

  categoryInitial(code: string): string {
    return this.categoryLabel(code).charAt(0).toUpperCase();
  }

  paymentMethodsLabel(paymentMethods: string[]): string {
    if (!paymentMethods || paymentMethods.length === 0) return '-';
    return paymentMethods.map((method) => this.PaymentMethod[method] ?? method).join(', ');
  }

  constructor(
    private expenseService: ExpenseService,
    private originService: OriginService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.originService.getOriginNames().subscribe((origins) => {
      this.originNames = origins;
    });

    const state = history.state;
    if (state?.expenseUpdated) {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Despesa atualizada com sucesso.' });
      history.replaceState({ ...state, expenseUpdated: false }, '');
    }
  }

  private filterValue(filters: any, field: string) {
    const meta = Array.isArray(filters?.[field]) ? filters[field][0] : filters?.[field];
    return meta?.value ?? undefined;
  }

  private buildFilters(filters: any): ExpenseFilters {
    const dateRange = this.filterValue(filters, 'date');
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;
    if (Array.isArray(dateRange) && dateRange[0]) {
      dateFrom = dateRange[0];
      dateTo = dateRange[1] ?? dateRange[0];
    }

    return {
      documentNumber: this.filterValue(filters, 'documentNumber'),
      dateFrom,
      dateTo,
      originId: this.filterValue(filters, 'origin'),
      paymentStatus: this.filterValue(filters, 'paymentStatus'),
      category: this.filterValue(filters, 'category')
    };
  }

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    const filters = event.filters ?? this.table?.filters ?? {};

    this.expenseService.getExpenses(this.currentPage, this.pageSize, this.buildFilters(filters)).subscribe((expenses) => {
      this.expenses = expenses.objectList;
      this.totalRecords = expenses.totalElements;
      this.loading = false;
    });
  }

  exportPdf() {
    this.exporting = true;

    const filters = this.table?.filters ?? {};

    this.expenseService.getExpenses(0, 100000, this.buildFilters(filters)).subscribe({
      next: (result) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setFontSize(14);
        doc.text('Despesas', 14, 15);

        autoTable(doc, {
          startY: 20,
          head: [['Data', 'Documento', 'Origem', 'Estado', 'Meio de Pagamento', 'Valor', 'Valor Pendente', 'Data Limite']],
          body: result.objectList.map((expense: ExpenseListItem) => [
            expense.date ? new Date(expense.date).toLocaleDateString('pt-PT') : '',
            expense.documentNumber,
            expense.origin ?? '',
            this.PaymentStatus[expense.paymentStatus] ?? expense.paymentStatus,
            this.paymentMethodsLabel(expense.paymentMethods),
            `${expense.totalValue.toFixed(2)} €`,
            `${expense.pendingValue.toFixed(2)} €`,
            expense.paymentDeadline ? new Date(expense.paymentDeadline).toLocaleDateString('pt-PT') : ''
          ])
        });

        doc.save('despesas.pdf');
        this.exporting = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível exportar as despesas.' });
        this.exporting = false;
      }
    });
  }

  selectedExpense!: ExpenseListItem;

  onRowSelect(event: any) {
    this.router.navigate(["pages/invoice", { expenseId: event.data.expenseId }]);
  }

  newExpense() {
    this.router.navigate(['./transactions/expenses/create-expense']);
  }

  editExpense(expense: ExpenseListItem) {
    this.router.navigate(['./transactions/expenses/edit-expense', expense.expenseId]);
  }

  deleteExpense(expense: ExpenseListItem) {
    this.confirmationService.confirm({
      header: `Apagar a despesa ${expense.documentNumber}?`,
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.expenseService.deleteExpense(expense.expenseId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Despesa eliminada com sucesso.' });
            this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
          },
          error: (err) => {
            const detail = err?.error?.message || 'Não foi possível eliminar a despesa.';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail });
          }
        });
      }
    });
  }

  getPaymentStatusSeverity(paymentStatus: PaymentStatus) {
    let status = paymentStatus;

    if (status == PaymentStatus.IN_DEBT) return "danger";
    else if (status == PaymentStatus.PARTIALLY_PAID) return "warning";
    else return "success";
  }

}
