import { Component } from '@angular/core';
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

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.getExpensesInDebt(this.currentPage, this.pageSize).subscribe((expensesInDebt) => {
      this.expensesInDebt = expensesInDebt;
      this.totalInDebt = this.expensesInDebt.reduce((exp, expense) => exp + expense.debtValue, 0);
    });
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

  isNumber(value: any): boolean {
    console.log(value);
    console.log(!isNaN(value));
    return !isNaN(value);
  }

}
