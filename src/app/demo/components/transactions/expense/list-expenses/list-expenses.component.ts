import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Expense } from 'src/app/demo/api/expense';
import { DocumentType } from 'src/app/demo/data/enum/documentType';
import { PaymentStatus } from 'src/app/demo/data/enum/paymentStatus';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';

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

export class ListExpensesComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  expenses!: Expense[];

  DocumentType = DocumentType;
  PaymentStatus: any = PaymentStatus;

  currentPage: number = 0;
  pageSize: number = 20;

  readonly categoryMeta: Record<string, { label: string; color: string }> = {
    BANK:          { label: 'Banco',        color: '#3b82f6' },
    TAXES:         { label: 'Impostos',     color: '#ef4444' },
    PEOPLE:        { label: 'Pessoal',      color: '#22c55e' },
    OPERATION:     { label: 'Operação',     color: '#8b5cf6' },
    COMMERCIAL:    { label: 'Comercial',    color: '#ec4899' },
    VEHICLES:      { label: 'Veículos',     color: '#f59e0b' },
    EQUIPMENTS:    { label: 'Equipamentos', color: '#14b8a6' },
    TOOLS:         { label: 'Ferramentas',  color: '#a16207' },
    INVENTORY:     { label: 'Inventário',   color: '#0ea5e9' },
    CONSTRUCTIONS: { label: 'Obras',        color: '#64748b' },
  };

  categoryLabel(code: string): string {
    return this.categoryMeta[code]?.label ?? code;
  }

  categoryColor(code: string): string {
    return this.categoryMeta[code]?.color ?? '#9ca3af';
  }

  categoryInitial(code: string): string {
    return this.categoryLabel(code).charAt(0).toUpperCase();
  }

  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.expenseService.getExpenses(this.currentPage, this.pageSize).subscribe((expenses) => {
      this.expenses = expenses.objectList;
      this.totalRecords = expenses.totalElements;
      console.log(expenses)
      this.loading = false;
    });
  }

  selectedExpense!: Expense;

  onRowSelect(event: any) {
    this.router.navigate(["pages/invoice", { expenseId: event.data.expenseId }]);
  }

  newExpense() {
    this.router.navigate(['./transactions/expenses/create-expense']);
  }

  deleteExpense(expense: Expense) {
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
