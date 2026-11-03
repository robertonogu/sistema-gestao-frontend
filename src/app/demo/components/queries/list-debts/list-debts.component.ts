import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableFilterEvent } from 'primeng/table';
import { ExpenseInDebt } from 'src/app/demo/api/expenseInDebt';
import { ORIGIN_GROUP_ORDER, OriginType, originGroupLabel } from 'src/app/demo/api/originType';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';

export interface DebtsByOrigin {
  originId: number;
  origin: string;
  originType: OriginType | null;
  expenses: ExpenseInDebt[];
  totalDebt: number;
}

@Component({
  templateUrl: './list-debts.component.html',
  providers: [ExpenseService]
})

export class ListDebtsComponent {

  expensesInDebt!: ExpenseInDebt[];
  debtsByOrigin: DebtsByOrigin[] = [];
  expandedRows: { [originId: number]: boolean } = {};
  totalRecords: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  totalInDebt: number = 0;
  now = new Date();

  constructor(private expenseService: ExpenseService, private router: Router) {}

  originOptions: { label: string; items: { label: string; value: number }[] }[] = [];

  ngOnInit(): void {
    this.expenseService.getExpensesInDebt(this.currentPage, this.pageSize).subscribe((expensesInDebt) => {
      this.expensesInDebt = expensesInDebt;
      this.debtsByOrigin = this.groupByOrigin(expensesInDebt);
      this.expandedRows = {};
      this.originOptions = this.buildOriginOptions(this.debtsByOrigin);
      this.updateTotal(this.debtsByOrigin);
    });
  }

  onFilter(event: TableFilterEvent) {
    this.updateTotal((event.filteredValue as DebtsByOrigin[]) ?? this.debtsByOrigin);
  }

  private updateTotal(rows: DebtsByOrigin[]) {
    this.totalInDebt = rows.reduce((sum, group) => sum + group.totalDebt, 0);
  }

  groupLabel(type: OriginType | null): string {
    return originGroupLabel(type);
  }

  startsGroup(rows: DebtsByOrigin[], rowIndex: number): boolean {
    return rowIndex === 0 || rows[rowIndex - 1]?.originType !== rows[rowIndex]?.originType;
  }

  private buildOriginOptions(groups: DebtsByOrigin[]) {
    return ORIGIN_GROUP_ORDER
      .map(type => ({
        label: originGroupLabel(type),
        items: groups.filter(group => group.originType === type)
          .sort((a, b) => a.origin.localeCompare(b.origin))
          .map(group => ({ label: group.origin, value: group.originId }))
      }))
      .filter(option => option.items.length);
  }

  private groupByOrigin(expenses: ExpenseInDebt[]): DebtsByOrigin[] {
    const groups = new Map<number, DebtsByOrigin>();
    for (const expense of expenses) {
      let group = groups.get(expense.originId);
      if (!group) {
        group = { originId: expense.originId, origin: expense.origin, originType: expense.originType ?? null, expenses: [], totalDebt: 0 };
        groups.set(expense.originId, group);
      }
      group.expenses.push(expense);
      group.totalDebt += expense.debtValue;
    }
    const typeIndex = (group: DebtsByOrigin) => group.originType ? ORIGIN_GROUP_ORDER.indexOf(group.originType) : ORIGIN_GROUP_ORDER.length;
    return [...groups.values()].sort((a, b) => typeIndex(a) - typeIndex(b) || b.totalDebt - a.totalDebt);
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

  payDebt(expense: ExpenseInDebt) {
    this.router.navigate(['/transactions/payments/create-payment'], {
      queryParams: { originId: expense.originId, expenseId: expense.id }
    });
  }

  isNumber(value: any): boolean {
    return !isNaN(value);
  }

}
