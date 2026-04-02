import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Supplier } from 'src/app/demo/api/supplier';
import { SupplierService } from 'src/app/demo/service/company/supplierService';

@Component({
  templateUrl: './list-suppliers.component.html',
})
export class ListSuppliersComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  suppliers!: Supplier[];

  currentPage: number = 0;
  pageSize: number = 5;

  constructor(
    private supplierService: SupplierService, 
    private router: Router
  ) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.supplierService.getSuppliers(this.currentPage, this.pageSize).subscribe((suppliers) => {
      this.suppliers = suppliers.objectList;
      this.totalRecords = suppliers.totalElements;
      this.loading = false;
    });
  }

  newSupplier() {
    this.router.navigate(['./company/suppliers/create-supplier']);
  }
}
