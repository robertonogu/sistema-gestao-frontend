import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountName } from 'src/app/demo/api/accountName';
import { ExpenseInDebt } from 'src/app/demo/api/expenseInDebt';
import { Origin } from 'src/app/demo/api/origin';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { ListPaymentCreation } from 'src/app/demo/data/model/listPaymentCreation.model';
import { PaymentCreation } from 'src/app/demo/data/model/paymentCreation.model';
import { AccountService, CASH_PAYMENT_METHOD_KEY, getPaymentMethodEntries } from 'src/app/demo/service/company/accountService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';
import { PaymentService } from 'src/app/demo/service/transactions/paymentService';
import { PaymentDocumentDetail } from 'src/app/demo/api/payment';
import { parseLocalDate } from 'src/app/demo/service/localDate.interceptor';

@Component({
  templateUrl: './create-payment.component.html',
  providers: [MessageService, ConfirmationService],
  styles: [`
     :host ::ng-deep .selected {
        border-left: 5px solid;
      }
  `]
})
export class CreatePaymentComponent {

  origins!: Origin[];
  accountNames: AccountName[] = [];

  date!: Date;
  documentNumber!: string
  selectedAccount!: number;
  selectedPaymentMethod!: PaymentMethod;
  selectedOrigin!: number;

  isCashAccountSelected: boolean = false;
  paymentMethodOptions: { key: string; value: string }[] = getPaymentMethodEntries(undefined);

  // Faturas em débito da origem, da mais antiga para a mais recente
  expenses: ExpenseInDebt[] = [];
  expensesSelected: ExpenseInDebt[] = [];
  expenseValues: number[] = [];

  sumTotalValues: number = 0;
  totalToPay: number | null = null;
  saving: boolean = false;

  // Edição de um pagamento existente (documento de pagamento com uma ou mais faturas)
  editingPaymentId?: number;

  constructor(
    private originService: OriginService,
    private accountService: AccountService,
    private expenseService: ExpenseService,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private _location: Location,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.originService.getOriginsGrouped().subscribe((origins) => {
      this.origins = origins;
    });

    const paymentDocumentId = Number(this.route.snapshot.paramMap.get('paymentDocumentId'));
    if (paymentDocumentId) this.editingPaymentId = paymentDocumentId;

    this.accountService.getAccountNamesWithType().subscribe((accountNames) => {
      this.accountNames = accountNames;
      if (this.editingPaymentId) {
        this.paymentService.getPayment(this.editingPaymentId).subscribe((payment) => this.loadPayment(payment));
      }
    });

    if (this.editingPaymentId) return;

    // Vindo da listagem de débitos: origem escolhida e a fatura já selecionada com o valor em débito
    const params = this.route.snapshot.queryParamMap;
    const originId = Number(params.get('originId'));
    if (originId) {
      this.selectedOrigin = originId;
      this.getExpenses(Number(params.get('expenseId')) || undefined);
    }
  }

  back() {
    this._location.back();
  }

  onAccountChange() {
    const cashBox = this.accountNames.find(account => account.objectId === this.selectedAccount)?.cashBox;
    this.isCashAccountSelected = !!cashBox;
    this.paymentMethodOptions = getPaymentMethodEntries(cashBox);

    if (this.isCashAccountSelected) {
      this.selectedPaymentMethod = CASH_PAYMENT_METHOD_KEY;
    } else if ((this.selectedPaymentMethod as unknown as string) === 'CASH') {
      this.selectedPaymentMethod = undefined as any;
    }
  }

  getExpenses(preselectExpenseId?: number) {
    this.expenseService.getExpensesFromOrigin(this.selectedOrigin).subscribe((expenses) => {
      this.expenses = [...expenses].sort((a, b) => this.expenseTime(a) - this.expenseTime(b) || a.id - b.id);
      this.expensesSelected = [];
      this.expenseValues = this.expenses.map(() => 0);
      this.sumTotalValues = 0;
      this.totalToPay = null;

      const preselected = this.expenses.find(expense => expense.id === preselectExpenseId);
      if (preselected) {
        this.expensesSelected = [preselected];
        this.expenseValues[this.expenses.indexOf(preselected)] = preselected.debtValue;
        this.updateSum();
      }
    });
  }

  // Preenche o formulário com o pagamento a editar: as faturas que ele paga ficam selecionadas com o valor pago
  private loadPayment(payment: PaymentDocumentDetail) {
    this.date = parseLocalDate(payment.date) as Date;
    this.documentNumber = payment.documentNumber ?? (undefined as any);
    this.selectedAccount = payment.accountId;
    this.onAccountChange();
    this.selectedPaymentMethod = payment.paymentMethod as unknown as PaymentMethod;
    this.selectedOrigin = payment.originId;

    this.expenses = payment.lines.map(line => ({
      id: line.expenseId,
      date: parseLocalDate(line.date),
      paymentDeadline: parseLocalDate(line.paymentDeadline),
      originId: payment.originId,
      origin: '',
      documentNumber: line.documentNumber,
      totalValue: line.totalValue,
      debtValue: line.debtValue
    }));
    this.expenseValues = payment.lines.map(line => line.paidValue);
    this.expensesSelected = this.expenses.filter((_, i) => this.expenseValues[i] > 0);
    this.updateSum();
  }

  private expenseTime(expense: ExpenseInDebt): number {
    const date = expense.date ?? expense.paymentDeadline;
    return date ? new Date(date).getTime() : 0;
  }

  get totalDebt(): number {
    return this.round(this.expenses.reduce((acc, expense) => acc + expense.debtValue, 0));
  }

  // Reparte o valor total pelas faturas em débito, da mais antiga para a mais recente
  distributeTotal(input: number | string | null) {
    const value = input == null || input === '' ? null : Number(input);
    this.totalToPay = value;
    let remaining = Math.min(value ?? 0, this.totalDebt);

    this.expenseValues = this.expenses.map((expense) => {
      const amount = this.round(Math.max(0, Math.min(remaining, expense.debtValue)));
      remaining = this.round(remaining - amount);
      return amount;
    });

    this.expensesSelected = this.expenses.filter((_, i) => this.expenseValues[i] > 0);
    this.updateSum(false);

  }

  selectAll(event: any) {
    this.expenseValues = this.expenses.map((expense) => event.checked ? expense.debtValue : 0);
    this.updateSum();
  }

  isSelected(expense: ExpenseInDebt): boolean {
    return this.expensesSelected.includes(expense);
  }

  onCheckboxChange(event: any) {
    const index = this.expenses.indexOf(event.data);
    this.expenseValues[index] = this.expenses[index].debtValue;
    this.updateSum();
  }

  onCheckboxUnchange(event: any) {
    const index = this.expenses.indexOf(event.data);
    this.expenseValues[index] = 0;
    this.updateSum();
  }

  changeValue() {
    this.updateSum();
  }

  private updateSum(syncTotal: boolean = true) {
    this.sumTotalValues = this.round(this.expenseValues.reduce((acc, value) => acc + (value ?? 0), 0));
    if (syncTotal) this.totalToPay = this.sumTotalValues;
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  newPayment() {
    if (!this.date || !this.selectedAccount || !this.selectedPaymentMethod || !this.selectedOrigin) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
      return;
    }

    const paymentCreationDTOList: PaymentCreation[] = [];
    for (let i = 0; i < this.expenses.length; i++) {
      const value = this.expenseValues[i] ?? 0;
      if (value > this.expenses[i].debtValue + 0.005) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O valor a pagar da fatura ' + this.expenses[i].documentNumber + ' excede o valor em débito.' });
        return;
      }
      if (value > 0) {
        paymentCreationDTOList.push({ value: value, expenseId: this.expenses[i].id });
      }
    }

    if (paymentCreationDTOList.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Indique o valor a pagar de pelo menos uma fatura.' });
      return;
    }

    const listPayments: ListPaymentCreation = {
      documentNumber: this.documentNumber, date: this.date, paymentMethod: this.selectedPaymentMethod,
      accountId: this.selectedAccount, paymentCreationDTOList: paymentCreationDTOList
    };

    this.saving = true;

    if (this.editingPaymentId) {
      this.paymentService.updatePayment(this.editingPaymentId, listPayments).subscribe({
        next: () => {
          this.saving = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pagamento atualizado com sucesso.' });
          this.back();
        },
        error: (err) => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível atualizar o pagamento.' });
        }
      });
      return;
    }

    this.paymentService.createPayment(listPayments).subscribe({
      next: () => {
        this.saving = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pagamento(s) registado(s) com sucesso.' });
        this.resetForm();
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível registar o pagamento.' });
      }
    });
  }

  deletePayment() {
    if (!this.editingPaymentId) return;
    const paymentDocumentId = this.editingPaymentId;

    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar este pagamento?',
      message: 'As faturas voltam a ficar em dívida pelo valor pago e os lançamentos na conta e na conta corrente são removidos.',
      accept: () => {
        this.paymentService.deletePayment(paymentDocumentId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pagamento eliminado com sucesso.' });
            this.back();
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.message ?? 'Não foi possível eliminar o pagamento.' })
        });
      }
    });
  }

  private resetForm(): void {
    this.date = undefined as any;
    this.documentNumber = undefined as any;
    this.selectedAccount = undefined as any;
    this.selectedPaymentMethod = undefined as any;
    this.selectedOrigin = undefined as any;
    this.isCashAccountSelected = false;
    this.paymentMethodOptions = getPaymentMethodEntries(undefined);
    this.expenses = [];
    this.expensesSelected = [];
    this.expenseValues = [];
    this.sumTotalValues = 0;
    this.totalToPay = null;
  }
}
