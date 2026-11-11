import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
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
import { ItemName } from 'src/app/demo/api/itemName';
import { CreditorService } from 'src/app/demo/service/company/creditorService';
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

  expenses: ExpenseInDebt[] = [];
  expensesSelected: ExpenseInDebt[] = [];
  expenseValues: number[] = [];

  sumTotalValues: number = 0;
  roundingFavorable: number = 0;
  roundingUnfavorable: number = 0;
  totalToPay: number | null = null;
  totalManual: boolean = false;
  postToCurrentAccount: boolean = false;
  saving: boolean = false;

  editingPaymentId?: number;


  paidByCreditor: boolean = false;
  selectedCreditor: number | null = null;
  creditorNames: ItemName[] = [];

  paidFromOptions: { label: string; items: { label: string; value: string }[] }[] = [];
  selectedPaidFrom: string | null = null;

  private buildPaidFromOptions() {
    this.paidFromOptions = [
      { label: 'Contas', items: (this.accountNames ?? []).map(account => ({ label: account.name, value: 'A' + account.objectId })) },
      { label: 'Credores', items: this.creditorNames.map(creditor => ({ label: creditor.name, value: 'C' + creditor.id })) }
    ].filter(group => group.items.length > 0);
  }

  onPaidFromChange() {
    const value = this.selectedPaidFrom ?? '';
    this.paidByCreditor = value.startsWith('C');
    this.selectedCreditor = this.paidByCreditor ? Number(value.substring(1)) : null;
    this.selectedAccount = !this.paidByCreditor && value ? Number(value.substring(1)) : undefined as any;
    this.onAccountChange();
  }

  constructor(
    private creditorService: CreditorService,
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
    const paymentDocumentId = Number(this.route.snapshot.paramMap.get('paymentDocumentId'));
    if (paymentDocumentId) this.editingPaymentId = paymentDocumentId;

    const onlyActive = !this.editingPaymentId && !Number(this.route.snapshot.queryParamMap.get('originId'));
    this.creditorService.getCreditorNames(onlyActive).subscribe(names => { this.creditorNames = names; this.buildPaidFromOptions(); });
    this.originService.getOriginsGrouped(onlyActive).subscribe((origins) => {
      this.origins = origins;
    });

    this.accountService.getAccountNamesWithType().subscribe((accountNames) => {
      this.accountNames = accountNames;
      this.buildPaidFromOptions();
      if (this.editingPaymentId) {
        this.paymentService.getPayment(this.editingPaymentId).subscribe((payment) => this.loadPayment(payment));
      }
    });

    if (this.editingPaymentId) return;

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
    forkJoin([
      this.expenseService.getExpensesFromOrigin(this.selectedOrigin),
      this.expenseService.getExpensesWithCreditFromOrigin(this.selectedOrigin)
    ]).subscribe(([inDebt, withCredit]) => {
      const byDate = (a: ExpenseInDebt, b: ExpenseInDebt) => this.expenseTime(a) - this.expenseTime(b) || a.id - b.id;
      this.expenses = [...inDebt.sort(byDate), ...withCredit.sort(byDate)];
      this.expensesSelected = [];
      this.expenseValues = this.expenses.map(() => 0);
      this.sumTotalValues = 0;
      this.totalToPay = null;
      this.totalManual = false;
      this.roundingFavorable = 0;
      this.roundingUnfavorable = 0;
      this.postToCurrentAccount = false;

      const preselected = this.expenses.find(expense => expense.id === preselectExpenseId);
      if (preselected) {
        this.expensesSelected = [preselected];
        this.expenseValues[this.expenses.indexOf(preselected)] = preselected.debtValue;
        this.updateSum();
      }
    });
  }

  private loadPayment(payment: PaymentDocumentDetail) {
    this.date = parseLocalDate(payment.date) as Date;
    this.documentNumber = payment.documentNumber ?? (undefined as any);
    this.paidByCreditor = !!payment.creditorId;
    this.selectedCreditor = payment.creditorId ?? null;
    this.selectedAccount = payment.accountId as number;
    this.selectedPaidFrom = payment.creditorId ? 'C' + payment.creditorId : payment.accountId ? 'A' + payment.accountId : null;
    this.onAccountChange();
    this.selectedPaymentMethod = payment.paymentMethod as unknown as PaymentMethod;
    this.selectedOrigin = payment.originId;
    const loadedFavorable = payment.roundingFavorable ?? 0;
    const loadedUnfavorable = payment.roundingUnfavorable ?? 0;

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
    this.expensesSelected = this.expenses.filter((_, i) => this.expenseValues[i] !== 0);
    this.postToCurrentAccount = !!payment.postedToCurrentAccount;
    this.updateSum();
    if (this.postToCurrentAccount) {
      const paidTotal = this.sumTotalValues;
      this.expenseValues = this.expenseValues.map((value, i) => this.expenses[i].debtValue > 0 ? Math.min(value, this.expenses[i].debtValue) : value);
      this.updateSum();
      this.totalManual = true;
      this.totalToPay = paidTotal;
      this.recalcRounding();
    }
    if (!this.postToCurrentAccount && (loadedFavorable > 0 || loadedUnfavorable > 0)) {
      this.totalManual = true;
      this.totalToPay = this.round(this.sumTotalValues - loadedFavorable + loadedUnfavorable);
      this.recalcRounding();
    }
  }

  private expenseTime(expense: ExpenseInDebt): number {
    const date = expense.date ?? expense.paymentDeadline;
    return date ? new Date(date).getTime() : 0;
  }

  isCredit(expense: ExpenseInDebt): boolean {
    return expense.debtValue < 0;
  }

  get totalDebt(): number {
    return this.round(this.expenses.filter(expense => !this.isCredit(expense)).reduce((acc, expense) => acc + expense.debtValue, 0));
  }

  get totalCredit(): number {
    return this.round(-this.expenses.filter(expense => this.isCredit(expense)).reduce((acc, expense) => acc + expense.debtValue, 0));
  }

  onTotalChange(input: number | string | null) {
    if (input == null || input === '') {
      this.totalManual = false;
      this.updateSum();
      return;
    }
    this.totalManual = true;
    this.totalToPay = Number(input);
    this.recalcRounding();
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

  private updateSum() {
    this.sumTotalValues = this.round(this.expenseValues.reduce((acc, value) => acc + (value ?? 0), 0));
    if (!this.totalManual) this.totalToPay = this.sumTotalValues;
    this.recalcRounding();
  }

  private recalcRounding() {
    if (!this.expenseValues.some(value => (value ?? 0) !== 0)) {
      this.postToCurrentAccount = false;
      this.roundingFavorable = 0;
      this.roundingUnfavorable = 0;
      return;
    }
    const difference = this.round((this.totalToPay ?? this.sumTotalValues) - this.sumTotalValues);
    if (difference <= 0) this.postToCurrentAccount = false;
    if (this.postToCurrentAccount && difference > 0) {
      this.roundingFavorable = 0;
      this.roundingUnfavorable = 0;
      return;
    }
    this.roundingFavorable = difference < 0 ? -difference : 0;
    this.roundingUnfavorable = difference > 0 ? difference : 0;
  }

  get canPostToCurrentAccount(): boolean {
    return this.postToCurrentAccount || this.roundingUnfavorable > 0;
  }


  get extraToCurrentAccount(): number {
    if (!this.postToCurrentAccount) return 0;
    return Math.max(this.round((this.totalToPay ?? this.sumTotalValues) - this.sumTotalValues), 0);
  }

  onPostToCurrentAccountChange() {
    this.recalcRounding();
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  newPayment() {
    const paidFromSelected = this.paidByCreditor ? !!this.selectedCreditor : !!this.selectedAccount;
    if (!this.date || !paidFromSelected || !this.selectedPaymentMethod || !this.selectedOrigin) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
      return;
    }

    const extra = this.extraToCurrentAccount;
    let extraIndex = -1;
    if (extra > 0) {
      for (let i = this.expenses.length - 1; i >= 0; i--) {
        if (!this.isCredit(this.expenses[i]) && (this.expenseValues[i] ?? 0) > 0) { extraIndex = i; break; }
      }
    }

    const paymentCreationDTOList: PaymentCreation[] = [];
    for (let i = 0; i < this.expenses.length; i++) {
      const value = this.round((this.expenseValues[i] ?? 0) + (i === extraIndex ? extra : 0));
      const expense = this.expenses[i];
      if (!this.isCredit(expense) && i !== extraIndex && (value < 0 || value > expense.debtValue + 0.005)) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O valor a pagar da fatura ' + expense.documentNumber + ' tem de estar entre 0 e o valor em débito.' });
        return;
      }
      if (this.isCredit(expense) && (value > 0 || value < expense.debtValue - 0.005)) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O crédito usado de ' + expense.documentNumber + ' tem de estar entre ' + expense.debtValue + ' € e 0.' });
        return;
      }
      if (value !== 0) {
        paymentCreationDTOList.push({ value: value, expenseId: expense.id });
      }
    }

    if (paymentCreationDTOList.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Indique o valor a pagar de pelo menos uma fatura.' });
      return;
    }

    const listPayments: ListPaymentCreation = {
      documentNumber: this.documentNumber, date: this.date, paymentMethod: this.selectedPaymentMethod,
      accountId: this.paidByCreditor ? 0 : this.selectedAccount, creditorId: this.paidByCreditor ? (this.selectedCreditor ?? 0) : 0,
      paymentCreationDTOList: paymentCreationDTOList,
      roundingFavorable: this.roundingFavorable ?? 0, roundingUnfavorable: this.roundingUnfavorable ?? 0,
      postedToCurrentAccount: extraIndex >= 0
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
    this.totalManual = false;
    this.roundingFavorable = 0;
    this.roundingUnfavorable = 0;
    this.postToCurrentAccount = false;
  }
}
