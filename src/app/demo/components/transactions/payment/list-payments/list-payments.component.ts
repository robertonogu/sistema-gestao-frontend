import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Payment } from 'src/app/demo/api/payment';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { PaymentService } from 'src/app/demo/service/transactions/paymentService';

@Component({
  templateUrl: './list-payments.component.html',
})
export class ListPaymentsComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  payments!: Payment[];

  currentPage: number = 0;
  pageSize: number = 5;

  PaymentMethod: any = PaymentMethod;

  constructor(
    private paymentService: PaymentService, 
    private router: Router
  ) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.paymentService.getPayments(this.currentPage, this.pageSize).subscribe((payments) => {
      this.payments = payments.objectList;
      this.totalRecords = payments.totalElements;
      this.loading = false;
    });
  }

  newPayment() {
    this.router.navigate(['./transactions/payments/create-payment']);
  }

  getPaymentMethodSeverity (paymentMethod: PaymentMethod) {
    let status = paymentMethod;

    if (status == PaymentMethod.BANK_TRANSFER) return "warning";
    else if (status == PaymentMethod.CASH) return "primary";
    else return "secondary";
  }

}
