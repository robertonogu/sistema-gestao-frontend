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
  pageSize: number = 20;

  MovementType: any = MovementType;

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
      this.currentPage = event.first / event.rows;
      this.pageSize = event.rows;

      this.loadAccountLogs();
    }
  }

  changeValue(event: any) {
    this.selectedAccount = event.value.objectId;
    this.currentPage = 0;

    this.loadAccountLogs();
  }

  private loadAccountLogs() {
    this.loading = true;

    this.accountLogService.getAccountLogs(this.selectedAccount, this.currentPage, this.pageSize).subscribe((accountLogs) => {
      this.accountLogs = accountLogs.objectList;
      this.totalRecords = accountLogs.totalElements;

      // The list comes newest-first, so the first row on page 0 holds the account's current balance.
      if (this.currentPage === 0) {
        this.balance = this.accountLogs.length > 0 ? this.accountLogs[0].balance : 0;
      }

      this.loading = false;
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
