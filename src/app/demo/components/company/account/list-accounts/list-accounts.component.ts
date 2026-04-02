import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Account } from 'src/app/demo/api/account';
import { AccountService } from 'src/app/demo/service/company/accountService';

@Component({
  templateUrl: './list-accounts.component.html',
})
export class ListAccountsComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  accounts!: Account[];

  currentPage: number = 0;
  pageSize: number = 5;

  constructor(
    private accountService: AccountService, 
    private router: Router
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


  newAccount() {
    this.router.navigate(['./company/accounts/create-account']);
  }
}
