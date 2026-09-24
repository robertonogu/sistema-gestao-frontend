import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpenseInDebt } from '../../api/expenseInDebt';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { ExpenseCreation } from '../../data/model/expenseCreation.model';
import { Expense } from '../../api/expense';
import { ExpenseEdit } from '../../api/expenseEdit';
import { ExpenseListItem } from '../../api/expenseListItem';

export interface ExpenseFilters {
    documentNumber?: string;
    dateFrom?: Date;
    dateTo?: Date;
    originIds?: number[];
    paymentStatus?: string;
    category?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {

    private expensesUrl = `${environment.apiUrl}/expenses`;
    private expensesInDebtUrl = `${environment.apiUrl}/expensesInDebt`;

    constructor(private http: HttpClient) { }

    getExpenses(currentPage: number, pageSize: number, filters?: ExpenseFilters) : Observable<ObjectList> {
        const url = this.expensesUrl + "?pageNo=" +  currentPage + "&pageSize=" + pageSize + this.filterParams(filters);
        return this.http.get<ObjectList>(url);
    }

    // Every expense matching the filters, without pagination (PDF/Excel export)
    exportExpenses(filters?: ExpenseFilters) : Observable<ExpenseListItem[]> {
        const url = this.expensesUrl + "/export?" + this.filterParams(filters).substring(1);
        return this.http.get<ExpenseListItem[]>(url);
    }

    private filterParams(filters?: ExpenseFilters): string {
        let params = "";
        if (filters?.documentNumber) params += "&documentNumber=" + encodeURIComponent(filters.documentNumber);
        if (filters?.dateFrom) params += "&dateFrom=" + this.formatDate(filters.dateFrom);
        if (filters?.dateTo) params += "&dateTo=" + this.formatDate(filters.dateTo);
        if (filters?.originIds?.length) params += "&originIds=" + filters.originIds.join(",");
        if (filters?.paymentStatus) params += "&paymentStatus=" + filters.paymentStatus;
        if (filters?.category) params += "&category=" + filters.category;
        return params;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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

    updateExpense(expenseId: number, expense: ExpenseCreation) : Observable<Expense> {
        let url = this.expensesUrl + "/" + expenseId;
        return this.http.put<Expense>(url, expense, environment.httpOptions);
    }

    getExpenseForEdit(expenseId: number) : Observable<ExpenseEdit> {
        let url = this.expensesUrl + "/" + expenseId + "/edit";
        return this.http.get<ExpenseEdit>(url);
    }

    deleteExpense(expenseId: number) : Observable<void> {
        return this.http.delete<void>(this.expensesUrl + "/" + expenseId);
    }

}