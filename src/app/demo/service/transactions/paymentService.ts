import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentList } from '../../api/paymentList';
import { environment } from 'src/environments/environment';
import { ListPaymentCreation } from '../../data/model/listPaymentCreation.model';
import { Payment } from '../../api/payment';

export interface PaymentFilters {
    documentNumber?: string;
    originId?: number;
    paymentMethod?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private paymentUrl = `${environment.apiUrl}/payments`;

    constructor(private http: HttpClient) { }

    getPayments(currentPage: number, pageSize: number, filters?: PaymentFilters) : Observable<PaymentList> {
        let url = this.paymentUrl + "?pageNo=" +  currentPage + "&pageSize=" + pageSize;

        if (filters?.documentNumber) url += "&documentNumber=" + encodeURIComponent(filters.documentNumber);
        if (filters?.originId != null) url += "&originId=" + filters.originId;
        if (filters?.paymentMethod) url += "&paymentMethod=" + filters.paymentMethod;

        return this.http.get<PaymentList>(url);
    }

    createPayment(listPayments: ListPaymentCreation) : Observable<Payment[]> {
        return this.http.post<Payment[]>(this.paymentUrl, listPayments, environment.httpOptions);
    }
}