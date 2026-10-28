import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Payment } from 'src/app/demo/api/payment';
import { OriginName } from 'src/app/demo/api/originType';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { PaymentFilters, PaymentService } from 'src/app/demo/service/transactions/paymentService';
import { OriginService } from 'src/app/demo/service/company/originService';

@Component({
  templateUrl: './list-payments.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListPaymentsComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  payments!: Payment[];

  currentPage: number = 0;
  pageSize: number = 20;

  PaymentMethod: any = PaymentMethod;
  originNames: OriginName[] = [];
  private lastLazyEvent: any = { first: 0, rows: 20 };

  constructor(
    private paymentService: PaymentService,
    private originService: OriginService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
    // Data: um dia (só a primeira data escolhida) ou um período
    const dateRange = this.filterValue(filters, 'date');
    const dateFrom: Date | undefined = Array.isArray(dateRange) ? dateRange[0] ?? undefined : undefined;
    const dateTo: Date | undefined = Array.isArray(dateRange) ? dateRange[1] ?? dateFrom : undefined;
    return {
      documentNumber: this.filterValue(filters, 'documentNumber'),
      originId: this.filterValue(filters, 'origin'),
      paymentMethod: this.filterValue(filters, 'paymentMethod'),
      dateFrom,
      dateTo
    };
  }

  nextPage(event: any) {
    this.lastLazyEvent = event;
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

  editPayment(payment: Payment) {
    this.router.navigate(['./transactions/payments/edit-payment', payment.paymentDocumentId]);
  }

  deletePayment(payment: Payment) {
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar este pagamento?',
      message: 'As faturas ' + payment.invoices + ' voltam a ficar em dívida pelo valor pago e os lançamentos na conta e na conta corrente são removidos.',
      accept: () => {
        this.paymentService.deletePayment(payment.paymentDocumentId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pagamento eliminado com sucesso.' });
            this.nextPage(this.lastLazyEvent);
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível eliminar o pagamento.' })
        });
      }
    });
  }

  getPaymentMethodSeverity (paymentMethod: PaymentMethod) {
    let status = paymentMethod;

    if (status == PaymentMethod.BANK_TRANSFER) return "warning";
    else if (status == PaymentMethod.CASH) return "primary";
    else return "secondary";
  }

}
