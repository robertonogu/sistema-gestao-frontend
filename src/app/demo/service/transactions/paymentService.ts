import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentList } from '../../api/paymentList';
import { environment } from 'src/environments/environment';
import { ListPaymentCreation } from '../../data/model/listPaymentCreation.model';
import { Payment } from '../../api/payment';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    constructor(private http: HttpClient) { }

    getPayments(currentPage: number, pageSize: number) : Observable<PaymentList> {
        let url = environment.transactions.payment.paymentUrl + "?pageNo=" +  currentPage + "&pageSize=" + pageSize;
        return this.http.get<PaymentList>(url);
    }

    createPayment(listPayments: ListPaymentCreation) : Observable<Payment[]> {
        return this.http.post<Payment[]>(environment.transactions.payment.paymentUrl, listPayments, environment.httpOptions);
    }
}