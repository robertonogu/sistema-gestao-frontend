import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpenseInDebt } from '../../api/expenseInDebt';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { ExpenseCreation } from '../../data/model/expenseCreation.model';
import { Expense } from '../../api/expense';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {

    constructor(private http: HttpClient) { }

    getExpenses(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.transactions.expense.expensesUrl + "?pageNo=" +  currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    getExpensesInDebt(currentPage: number, pageSize: number) : Observable<ExpenseInDebt[]> {
        let url = environment.queries.debts.expensesInDebtUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize + "&sortBy=paymentDeadline&sortDirection=DESC";
        return this.http.get<ExpenseInDebt[]>(url);
    }

    getExpensesFromOrigin(originId: number) : Observable<ExpenseInDebt[]> {
        let url = environment.queries.debts.expensesInDebtUrl + "/" + originId;
        return this.http.get<ExpenseInDebt[]>(url);
    }
    
    createExpense(expense: ExpenseCreation) : Observable<Expense> {
        return this.http.post<Expense>(environment.transactions.expense.expensesUrl, expense, environment.httpOptions);
    }

}