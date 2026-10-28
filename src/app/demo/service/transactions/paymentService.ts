import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentList } from '../../api/paymentList';
import { environment } from 'src/environments/environment';
import { ListPaymentCreation } from '../../data/model/listPaymentCreation.model';
import { ExpensePayment, PaymentDocumentDetail } from '../../api/payment';
import { formatLocalDate } from '../localDate.interceptor';

export interface PaymentFilters {
    documentNumber?: string;
    originId?: number;
    paymentMethod?: string;
    // Um dia (dateFrom = dateTo) ou um período
    dateFrom?: Date;
    dateTo?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private paymentUrl = `${environment.apiUrl}/payments`;
    private expensesUrl = `${environment.apiUrl}/expenses`;

    constructor(private http: HttpClient) { }

    getPayments(currentPage: number, pageSize: number, filters?: PaymentFilters) : Observable<PaymentList> {
        let url = this.paymentUrl + "?pageNo=" +  currentPage + "&pageSize=" + pageSize;

        if (filters?.documentNumber) url += "&documentNumber=" + encodeURIComponent(filters.documentNumber);
        if (filters?.originId != null) url += "&originId=" + filters.originId;
        if (filters?.paymentMethod) url += "&paymentMethod=" + filters.paymentMethod;
        if (filters?.dateFrom) url += "&dateFrom=" + formatLocalDate(filters.dateFrom);
        if (filters?.dateTo) url += "&dateTo=" + formatLocalDate(filters.dateTo);

        return this.http.get<PaymentList>(url);
    }

    getPayment(paymentDocumentId: number) : Observable<PaymentDocumentDetail> {
        return this.http.get<PaymentDocumentDetail>(this.paymentUrl + "/" + paymentDocumentId);
    }

    getPaymentsForExpense(expenseId: number) : Observable<ExpensePayment[]> {
        return this.http.get<ExpensePayment[]>(this.expensesUrl + "/" + expenseId + "/payments");
    }

    createPayment(listPayments: ListPaymentCreation) : Observable<void> {
        return this.http.post<void>(this.paymentUrl, listPayments, environment.httpOptions);
    }

    updatePayment(paymentDocumentId: number, listPayments: ListPaymentCreation) : Observable<void> {
        return this.http.put<void>(this.paymentUrl + "/" + paymentDocumentId, listPayments, environment.httpOptions);
    }

    deletePayment(paymentDocumentId: number) : Observable<void> {
        return this.http.delete<void>(this.paymentUrl + "/" + paymentDocumentId);
    }
}
