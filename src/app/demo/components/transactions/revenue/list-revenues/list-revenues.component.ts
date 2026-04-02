import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Revenue } from 'src/app/demo/api/revenue';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { RevenueType } from 'src/app/demo/data/enum/revenueType';
import { RevenueService } from 'src/app/demo/service/transactions/revenueService';

@Component({
  templateUrl: './list-revenues.component.html'
})
export class ListRevenuesComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  revenues!: Revenue[];

  currentPage: number = 0;
  pageSize: number = 5;

  RevenueType: any = RevenueType;
  PaymentMethod = PaymentMethod;

  constructor(private revenueService: RevenueService, private router: Router) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.revenueService.getRevenues(this.currentPage, this.pageSize).subscribe((revenues) => {
      this.revenues = revenues.revenueList;
      this.totalRecords = revenues.totalElements;
      this.loading = false;
    });
  }

  newRevenue() {
    this.router.navigate(['./transactions/revenues/create-revenue']);
  }

}
