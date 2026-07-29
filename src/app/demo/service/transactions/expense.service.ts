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

    private expensesUrl = `${environment.apiUrl}/expenses`;
    private expensesInDebtUrl = `${environment.apiUrl}/expensesInDebt`;

    constructor(private http: HttpClient) { }

    getExpenses(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.expensesUrl + "?pageNo=" +  currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    getExpenseById(expenseId: number) : Observable<Expense> {
        let url = this.expensesUrl + "/" + expenseId;
        console.log(this.http.get<Expense>(url));
        return this.http.get<Expense>(url);
    }

    getExpensesInDebt(currentPage: number, pageSize: number) : Observable<ExpenseInDebt[]> {
        let url = this.expensesInDebtUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize + "&sortBy=paymentDeadline&sortDirection=DESC";
        return this.http.get<ExpenseInDebt[]>(url);
    }

    getExpensesFromOrigin(originId: number) : Observable<ExpenseInDebt[]> {
        let url = this.expensesInDebtUrl + "/" + originId;
        return this.http.get<ExpenseInDebt[]>(url);
    }

    createExpense(expense: ExpenseCreation) : Observable<Expense> {
        return this.http.post<Expense>(this.expensesUrl, expense, environment.httpOptions);
    }

}