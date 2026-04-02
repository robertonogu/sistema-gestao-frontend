import { Component } from '@angular/core';
import { AccountLog } from 'src/app/demo/api/accountLogs';
import { ObjectName } from 'src/app/demo/api/objectName';
import { MovementType } from 'src/app/demo/data/enum/movementType';
import { AccountLogService } from 'src/app/demo/service/queries/accountLogService';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  templateUrl: './list-account-logs.component.html',
})
export class ListAccountLogsComponent {

  balance: number = 0;

  accountNames!: ObjectName[];
  selectedAccount!: number;

  loading: boolean = false;
  totalRecords: number = 0;
  accountLogs: AccountLog[] = [];

  currentPage: number = 0;
  pageSize: number = 5;

  MovementType = MovementType;

  constructor(
    private accountService: AccountService,
    private accountLogService: AccountLogService
  ) {}

  ngOnInit(): void {
    this.accountService.getBankAccountNames().subscribe((accountNames) => {
      this.accountNames = accountNames;
    });
  }

  nextPage(event: any) {
    if (this.selectedAccount != null) {
      this.loading = true;
      
      this.currentPage = event.first / event.rows;
      this.pageSize = event.rows;
      
      this.accountLogService.getAccountLogs(this.selectedAccount, this.currentPage, this.pageSize).subscribe((accountLogs) => {
        this.accountLogs = accountLogs.objectList;
        this.totalRecords = accountLogs.totalElements;
        this.loading = false;
        this.balance = this.accountLogs[0].balance;
        
      });
    }
  }

  changeValue(event: any) {
    this.selectedAccount = event.value.objectId;
    this.accountLogService.getAccountLogs(this.selectedAccount, this.currentPage, this.pageSize).subscribe((accountLogs) => {
      this.accountLogs = accountLogs.objectList;
      this.totalRecords = accountLogs.totalElements;
    });
  }

  getBalanceColor(balance: number): string {
    if (balance > 0) {
      return 'var(--green-600)';
    } else if (balance < 0) {
      return 'var(--red-600)';
    } else {
      return 'black';
    }
  }
}
