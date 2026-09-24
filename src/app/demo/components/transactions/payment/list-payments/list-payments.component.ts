import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Payment } from 'src/app/demo/api/payment';
import { ItemName } from 'src/app/demo/api/itemName';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { PaymentFilters, PaymentService } from 'src/app/demo/service/transactions/paymentService';
import { OriginService } from 'src/app/demo/service/company/originService';

@Component({
  templateUrl: './list-payments.component.html',
})
export class ListPaymentsComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  payments!: Payment[];

  currentPage: number = 0;
  pageSize: number = 20;

  PaymentMethod: any = PaymentMethod;
  originNames: ItemName[] = [];

  constructor(
    private paymentService: PaymentService,
    private originService: OriginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.originService.getOriginNamesWithPayments().subscribe((origins) => {
      this.originNames = origins;
    });
  }

  private filterValue(filters: any, field: string) {
    const meta = Array.isArray(filters?.[field]) ? filters[field][0] : filters?.[field];
    return meta?.value ?? undefined;
  }

  private buildFilters(filters: any): PaymentFilters {
    return {
      documentNumber: this.filterValue(filters, 'documentNumber'),
      originId: this.filterValue(filters, 'origin'),
      paymentMethod: this.filterValue(filters, 'paymentMethod')
    };
  }

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    const filters = event.filters ?? {};

    this.paymentService.getPayments(this.currentPage, this.pageSize, this.buildFilters(filters)).subscribe((payments) => {
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
