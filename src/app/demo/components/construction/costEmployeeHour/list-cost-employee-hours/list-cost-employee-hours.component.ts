import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Construction } from 'src/app/demo/api/construction';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { CostEmployeeHour } from 'src/app/demo/api/costEmployeeHour';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { CostEmployeeHourService } from 'src/app/demo/service/construction/costEmployeeHourService';

@Component({
  templateUrl: './list-cost-employee-hours.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListCostEmployeeHoursComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  costEmployeeHours!: CostEmployeeHour[];

  currentPage: number = 0;
  pageSize: number = 5;

  constructor(
    private costEmployeeHourService: CostEmployeeHourService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.costEmployeeHourService.getCostEmployeeHours(this.currentPage, this.pageSize).subscribe((costEmployeeHours) => {
      this.costEmployeeHours = costEmployeeHours.objectList;
      this.totalRecords = costEmployeeHours.totalElements;
      this.loading = false;
    });
  }

  newCostEmployeeHour() {
    this.router.navigate(['./constructions/costEmployeeHours/create-costEmployeeHour']);
  }

  deleteCostEmployeeHour(costEmployeeHour: CostEmployeeHour) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.costEmployeeHourService.deleteCostEmployeeHour(costEmployeeHour.costEmployeeHourId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Custo por hora eliminado com sucesso.' });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }

}
