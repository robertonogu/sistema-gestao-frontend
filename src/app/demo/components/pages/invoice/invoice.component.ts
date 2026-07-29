import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Expense } from 'src/app/demo/api/expense';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';

@Component({
    templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit {

    constructor(private route: ActivatedRoute, private expenseService: ExpenseService) { }

    expense!: Expense;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['expenseId']) {
                this.expenseService.getExpenseById(params['expenseId']).subscribe(expense => {
                    this.expense = expense;
                });
            }
        });
    }

    fmt(n: number): string {
        return (n || 0).toLocaleString('de-DE', {
            minimumFractionDigits: 2, maximumFractionDigits: 2,
        }) + ' €';
    }

}
