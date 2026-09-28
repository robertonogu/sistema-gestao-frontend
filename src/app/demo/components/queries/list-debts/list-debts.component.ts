import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableFilterEvent } from 'primeng/table';
import { ExpenseInDebt } from 'src/app/demo/api/expenseInDebt';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';

@Component({
  templateUrl: './list-debts.component.html',
  providers: [ExpenseService]
})

export class ListDebtsComponent {

  expensesInDebt!: ExpenseInDebt[];
  totalRecords: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  totalInDebt: number = 0;
  now = new Date();

  constructor(private expenseService: ExpenseService, private router: Router) {}

  // Origins that currently have debts (options of the origin filter)
  originOptions: string[] = [];

  ngOnInit(): void {
    this.expenseService.getExpensesInDebt(this.currentPage, this.pageSize).subscribe((expensesInDebt) => {
      this.expensesInDebt = expensesInDebt;
      this.originOptions = [...new Set(expensesInDebt.map(expense => expense.origin).filter(Boolean))].sort();
      this.updateTotal(this.expensesInDebt);
    });
  }

  // Total in debt of the rows shown: every row when there is no filter, only the filtered ones otherwise
  onFilter(event: TableFilterEvent) {
    this.updateTotal((event.filteredValue as ExpenseInDebt[]) ?? this.expensesInDebt);
  }

  private updateTotal(rows: ExpenseInDebt[]) {
    this.totalInDebt = rows.reduce((sum, expense) => sum + expense.debtValue, 0);
  }

  formatDate(date: string | null): string | undefined {
    return date ? new Date(date).toLocaleDateString('en-GB') : undefined;
  }

  getSeverity(date: Date) {
    const difference = new Date(date).getTime() - this.now.getTime();
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    if(difference < oneDayInMillis) {
      return "danger";
    }
    else if (difference > oneDayInMillis && difference < (oneDayInMillis * 7)) {
      return "warning";
    }
    else return "info";
  }

  getDate(date: Date) {
    const currentDate: Date = new Date();
    const pastDate: Date = new Date(date);
    const timeDifference: number = currentDate.getTime() - pastDate.getTime();
    const daysDifference: number = Math.floor(timeDifference / (1000 * 3600 * 24));
    if (daysDifference > 0) return daysDifference;
    else return date;
  }

  // Abre o novo pagamento com a origem desta fatura escolhida e a fatura já selecionada
  payDebt(expense: ExpenseInDebt) {
    this.router.navigate(['/transactions/payments/create-payment'], {
      queryParams: { originId: expense.originId, expenseId: expense.id }
    });
  }

  isNumber(value: any): boolean {
    return !isNaN(value);
  }

}
