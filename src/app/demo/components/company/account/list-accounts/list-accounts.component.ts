import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Account } from 'src/app/demo/api/account';
import { AccountCreation } from 'src/app/demo/data/model/accountCreation.model';
import { AccountService } from 'src/app/demo/service/company/accountService';

@Component({
  templateUrl: './list-accounts.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListAccountsComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  accounts!: Account[];

  currentPage: number = 0;
  pageSize: number = 20;

  accountDialog: boolean = false;
  submitted: boolean = false;
  account: Partial<Account> = {};

  constructor(
    private accountService: AccountService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    this.accountService.getAccounts(this.currentPage, this.pageSize).subscribe((accounts) => {
      this.accounts = accounts.objectList;
      this.totalRecords = accounts.totalElements;
      this.loading = false;
    });
  }

  openNew() {
    this.account = { cashBox: false };
    this.submitted = false;
    this.accountDialog = true;
  }

  editAccount(account: Account) {
    this.account = { ...account };
    this.submitted = false;
    this.accountDialog = true;
  }

  hideDialog() {
    this.accountDialog = false;
    this.submitted = false;
  }

  saveAccount() {
    this.submitted = true;

    if (this.account.name?.trim()) {
      const accountCreation = {
        name: this.account.name,
        initialBalance: this.account.initialBalance,
        cashBox: this.account.cashBox ?? false
      } as AccountCreation;

      if (this.account.originId) {
        this.accountService.updateAccount(this.account.originId, accountCreation).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta atualizada com sucesso.' });
            this.accountDialog = false;
            this.account = {};
            this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
          },
          error: (err: HttpErrorResponse) => {
            const detail = err.error?.message || 'Existem campos por preencher.';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail });
          }
        });
      } else {
        this.accountService.createAccount(accountCreation).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta adicionada com sucesso.' });
            this.accountDialog = false;
            this.account = {};
            this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
          },
          error: (err: HttpErrorResponse) => {
            const detail = err.error?.message || 'Existem campos por preencher.';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail });
          }
        });
      }
    }
  }

  deleteAccount(account: Account) {
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar a conta ' + account.name + '?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.accountService.deleteAccount(account.originId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta eliminada com sucesso.' });
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
