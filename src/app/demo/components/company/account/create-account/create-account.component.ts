import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AccountCreation } from 'src/app/demo/data/model/accountCreation.model';
import { ClientCreation } from 'src/app/demo/data/model/clientCreation.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { ClientService } from 'src/app/demo/service/company/clientService';

@Component({
  templateUrl: './create-account.component.html',
  providers: [MessageService]
})
export class CreateAccountComponent {

  name!: string;
  bank!: string;
  initialBalance!: number;

  account!: AccountCreation;

  constructor(
    private accountService: AccountService, 
    private messageService: MessageService,
    private _location: Location
  ) { }

  back() {
    this._location.back();
  }

  newAccount() {
    this.account = { name: this.name, bank: this.bank, initialBalance: this.initialBalance } as AccountCreation;

    if (this.account != null) {
      this.accountService.createAccount(this.account).subscribe(newAccount => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta adicionada com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
