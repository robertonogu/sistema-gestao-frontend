import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Expense } from 'src/app/demo/api/expense';
import { CategoryType } from 'src/app/demo/data/enum/categoryType';
import { DocumentType } from 'src/app/demo/data/enum/documentType';
import { PaymentStatus } from 'src/app/demo/data/enum/paymentStatus';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';

@Component({
  templateUrl: 'list-expenses.component.html',
})

export class ListExpensesComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  expenses!: Expense[];

  CategoryType: any = CategoryType;
  DocumentType = DocumentType;
  PaymentStatus: any = PaymentStatus;

  currentPage: number = 0;
  pageSize: number = 5;

  constructor(private expenseService: ExpenseService, private router: Router) {}

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
    console.log(event.data.name)
    console.log(this.selectedExpense)
    let expense = this.selectedExpense;
    console.log(expense)
    this.router.navigate(["pages/invoice", { expense: JSON.stringify(expense) }]);
  }

  newExpense() {
    this.router.navigate(['./transactions/expenses/create-expense']);
  }

  getCategorySeverity(category: CategoryType) {
    let status = category;

    if (status == CategoryType.VEHICLES) return "info";
    else if (status == CategoryType.EQUIPMENTS) return "primary";
    else if (status == CategoryType.TOOLS) return "secondary";
    else if (status == CategoryType.INVENTORY) return "contrast";
    else if (status == CategoryType.CONSTRUCTIONS) return "primary";
    else if (status == CategoryType.PEOPLE) return "success"; 
    else return "constrast";
  }

  getPaymentStatusSeverity(paymentStatus: PaymentStatus) {
    let status = paymentStatus;

    if (status == PaymentStatus.IN_DEBT) return "danger";
    else if (status == PaymentStatus.PARTIALLY_PAID) return "warning";
    else return "success";
  }

}
