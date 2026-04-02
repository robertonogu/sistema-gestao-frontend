import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ExpenseInDebt } from 'src/app/demo/api/expenseInDebt';
import { ItemName } from 'src/app/demo/api/itemName';
import { ObjectName } from 'src/app/demo/api/objectName';
import { Origin } from 'src/app/demo/api/origin';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { ListPaymentCreation } from 'src/app/demo/data/model/listPaymentCreation.model';
import { PaymentCreation } from 'src/app/demo/data/model/paymentCreation.model';
import { RevenueCreation } from 'src/app/demo/data/model/revenueCreation.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { ClientService } from 'src/app/demo/service/company/clientService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { SupplierService } from 'src/app/demo/service/company/supplierService';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';
import { PaymentService } from 'src/app/demo/service/transactions/paymentService';

@Component({
  templateUrl: './create-payment.component.html',
  providers: [MessageService],
  styles: [`
     :host ::ng-deep .selected {
        border-left: 5px solid;
      }
  `]
})
export class CreatePaymentComponent {

  origins!: Origin[];
  accountNames!: ObjectName[];
  paymentMethods = PaymentMethod;

  date!: Date;
  documentNumber!: string
  selectedAccount!: number;
  selectedPaymentMethod!: PaymentMethod;
  selectedOrigin!: number;
  expenses!: ExpenseInDebt[];

  selectedExpenses: ExpenseInDebt[] = [];
  
  expensesSelected: ExpenseInDebt[] = [];
  expenseValues: number[] = [];

  revenue!: RevenueCreation;

  payments!: ListPaymentCreation;
  sumTotalValues: number = 0;
  paymentCreationDTOList: PaymentCreation[] = [];

  constructor(
    private originService: OriginService, 
    private accountService: AccountService, 
    private expenseService: ExpenseService,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.originService.getOriginsGrouped().subscribe((origins) => {
      this.origins = origins;
    });

    this.accountService.getAccountNames().subscribe((accountNames) => {
      this.accountNames = accountNames;
    });
  }

  back() {
    this._location.back();
  }

  getExpenses() {
    this.expenseService.getExpensesFromOrigin(this.selectedOrigin).subscribe((expenses) => {
      this.expenses = expenses;
      this.selectedExpenses = expenses;
      this.expenseValues = this.selectedExpenses.map(() => 0);
    });
  }

  selectAll(event: any) {
    if (event.checked) {
      this.sumTotalValues = 0;
      this.selectedExpenses.forEach((expense, index) => {
        this.expenseValues[index] = expense.debtValue;
        this.sumTotalValues += expense.debtValue;
      });
    }
    else {
      this.expenseValues = this.selectedExpenses.map(() => 0);
      this.sumTotalValues = 0;
    }
  }

  isSelected(expense: ExpenseInDebt): boolean {
    return this.expensesSelected.includes(expense);
  }

  onCheckboxChange(event: any) {
    const selectedIndex = this.selectedExpenses.indexOf(event.data);
    this.sumTotalValues += this.selectedExpenses[selectedIndex].debtValue;
    this.expenseValues[selectedIndex] = this.selectedExpenses[selectedIndex].debtValue;
  }

  onCheckboxUnchange(event: any) {
    const selectedIndex = this.selectedExpenses.indexOf(event.data);
    this.sumTotalValues -= this.expenseValues[selectedIndex];
    this.expenseValues[selectedIndex] = 0;
  }

  changeValue() {
    this.sumTotalValues = this.expenseValues.reduce((acc, value) => acc + value, 0);
  }

  newPayment() {;
    for (let i = 0; i < this.expenseValues.length; i++) {
      if (this.expenseValues[i] != 0) {
        const paymentCreation = { value: this.expenseValues[i], expenseId: this.selectedExpenses[i].id } as PaymentCreation;
        this.paymentCreationDTOList.push(paymentCreation);
      }
    }

    const listPayments = { documentNumber: this.documentNumber, date: this.date, paymentMethod: this.selectedPaymentMethod, accountId: this.selectedAccount, paymentCreationDTOList: this.paymentCreationDTOList } as ListPaymentCreation;

    if (this.paymentCreationDTOList != null) {
      this.paymentService.createPayment(listPayments).subscribe(newPayment => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pagamento(s) registado(s) com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
