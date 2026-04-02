import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { CostEmployeeHour } from 'src/app/demo/api/costEmployeeHour';
import { ExternalService } from 'src/app/demo/api/externalService';
import { ExternalServiceService } from 'src/app/demo/service/construction/externalServiceService';

@Component({
  templateUrl: './list-external-services.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ListExternalServicesComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  externalServices!: ExternalService[];
  
  currentPage: number = 0;
  pageSize: number = 5;

  constructor(
    private externalServiceService: ExternalServiceService, 
  ) {}
  
  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.externalServiceService.getExternalServices(this.currentPage, this.pageSize).subscribe((externalServices) => {
      this.externalServices = externalServices.objectList;
      this.totalRecords = externalServices.totalElements;
      this.loading = false;
    });
  }

}
