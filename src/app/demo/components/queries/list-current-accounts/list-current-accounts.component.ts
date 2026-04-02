import { Component, OnInit } from '@angular/core';
import { CurrentAccountLog } from 'src/app/demo/api/currentAccountLog';
import { Origin } from 'src/app/demo/api/origin';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { CurrentAccountLogService } from 'src/app/demo/service/queries/currentAccountLogService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  templateUrl: './list-current-accounts.component.html'
})
export class ListCurrentAccountsComponent implements OnInit {

  origins!: Origin[];
  selectedOrigin!: number;

  loading: boolean = false;
  totalRecords: number = 0;
  currentAccountLogs: CurrentAccountLog[] = [];

  currentPage: number = 0;
  pageSize: number = 5;

  PaymentMethod: any = PaymentMethod;

  constructor(
    private originService: OriginService, 
    private currentAccountLogService: CurrentAccountLogService
  ) {}

  ngOnInit(): void {
    this.originService.getOriginsGrouped().subscribe((origins) => {
      this.origins = origins;
    });
  }

  nextPage(event: any) {
    if (this.selectedOrigin != null) {
      this.loading = true;
      
      this.currentPage = event.first / event.rows;
      this.pageSize = event.rows;
      
      this.currentAccountLogService.getCurrentAccountLogs(this.currentPage, this.pageSize, this.selectedOrigin).subscribe((currentAccountLogs) => {
        this.currentAccountLogs = currentAccountLogs.objectList;
        this.totalRecords = currentAccountLogs.totalElements;
        this.loading = false;
      });
    }
  }

  changeValue(event: any) {
    this.selectedOrigin = event.value;
    this.currentAccountLogService.getCurrentAccountLogs(this.currentPage, this.pageSize, this.selectedOrigin).subscribe((currentAccountLogs) => {
      this.currentAccountLogs = currentAccountLogs.objectList;
      this.totalRecords = currentAccountLogs.totalElements;
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
