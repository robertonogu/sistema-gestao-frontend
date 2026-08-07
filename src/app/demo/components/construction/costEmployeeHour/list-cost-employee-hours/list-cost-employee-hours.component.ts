import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { CostEmployeeHour } from 'src/app/demo/api/costEmployeeHour';
import { ItemName } from 'src/app/demo/api/itemName';
import { CostEmployeeHourCreation } from 'src/app/demo/data/model/costEmployeeHourCreation.model';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { CostEmployeeHourService } from 'src/app/demo/service/construction/costEmployeeHourService';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';

@Component({
  templateUrl: './list-cost-employee-hours.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListCostEmployeeHoursComponent {

  loading: boolean = true;
  totalRecords: number = 0;
  costEmployeeHours!: CostEmployeeHour[];

  currentPage: number = 0;
  pageSize: number = 20;

  employeeNames!: ItemName[];
  constructionNames!: ConstructionNames[];

  costEmployeeHourDialog: boolean = false;
  submitted: boolean = false;
  selectedEmployee?: number;
  selectedConstruction?: number;
  hourCost?: number;

  constructor(
    private constructionService: ConstructionService,
    private employeeService: EmployeeService,
    private costEmployeeHourService: CostEmployeeHourService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  getEmployeeNames() {
    if (!this.selectedConstruction) {
      return;
    }

    this.employeeService.getEmployeeNamesNotInCostEmployeeHourForConstruction(this.selectedConstruction).subscribe((employeeNames) => {
      this.employeeNames = employeeNames;
    });
  }

  openNew() {
    this.selectedEmployee = undefined;
    this.selectedConstruction = undefined;
    this.hourCost = undefined;
    this.employeeNames = [];
    this.submitted = false;

    this.constructionService.getConstructionNames().subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });

    this.costEmployeeHourDialog = true;
  }

  hideDialog() {
    this.costEmployeeHourDialog = false;
    this.submitted = false;
  }

  saveCostEmployeeHour() {
    this.submitted = true;

    if (this.selectedConstruction && this.selectedEmployee) {
      const costEmployeeHour = { employeeId: this.selectedEmployee, constructionId: this.selectedConstruction, hourCost: this.hourCost } as CostEmployeeHourCreation;

      this.costEmployeeHourService.createCostEmployeeHour(costEmployeeHour).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Custo por hora adicionado com sucesso.' });
        this.costEmployeeHourDialog = false;
        this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
      });
    }
  }

  deleteCostEmployeeHour(costEmployeeHour: CostEmployeeHour) {
    this.confirmationService.confirm({
      header: 'Tem a certeza?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.costEmployeeHourService.deleteCostEmployeeHour(costEmployeeHour.costEmployeeHourId).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Custo por hora eliminado com sucesso.' });
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }

}
