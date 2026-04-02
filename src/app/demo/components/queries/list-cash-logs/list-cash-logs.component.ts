import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { AccountLog } from 'src/app/demo/api/accountLogs';
import { MovementType } from 'src/app/demo/data/enum/movementType';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { AccountLogService } from 'src/app/demo/service/queries/accountLogService';

@Component({
  templateUrl: './list-cash-logs.component.html',
})
export class ListCashLogsComponent {

  balance!: number;

  loading: boolean = true;
  totalRecords: number = 0;
  accountLogs!: AccountLog[];

  currentPage: number = 0;
  pageSize: number = 5;

  MovementType: any = MovementType;

  constructor(
    private accountLogService: AccountLogService
  ) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.accountLogService.getCashAccountLogs(this.currentPage, this.pageSize).subscribe((accountLogs) => {
      this.accountLogs = accountLogs.objectList;
      this.totalRecords = accountLogs.totalElements;
      // isto só deve ser colocado pela primeira vez
      this.balance = this.accountLogs[0].balance;
      this.loading = false;
    });
  }

  getBalanceColor(balance: number): string {
    if (balance > 0) {
      return 'var(--green-500)';
    } else if (balance < 0) {
      return 'var(--red-500)';
    } else {
      return 'black';
    }
  }

}
