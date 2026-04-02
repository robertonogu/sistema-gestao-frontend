import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { CostEmployeeHourCreation } from 'src/app/demo/data/model/costEmployeeHourCreation.model';
import { VehicleCostCreation } from 'src/app/demo/data/model/vehicleCostCreation';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { CostEmployeeHourService } from 'src/app/demo/service/construction/costEmployeeHourService';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';

@Component({
  templateUrl: './create-cost-employee-hour.component.html',
  providers: [ConfirmationService, MessageService]
})
export class CreateCostEmployeeHourComponent {

  employeeNames!: ItemName[];
  constructionNames!: ConstructionNames[];

  selectedEmployee!: number;
  selectedConstruction!: number;
  hourCost!: number;

  costEmployeeHour!: CostEmployeeHourCreation;

  constructor(
    private constructionService: ConstructionService,
    private employeeService: EmployeeService, 
    private _location: Location,
    private messageService: MessageService,
    private costEmployeeHourService: CostEmployeeHourService) { }

  ngOnInit(): void {
    this.constructionService.getConstructionNames().subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });
  }

  getEmployeeNames() {
    console.log(this.selectedConstruction);
    this.employeeService.getEmployeeNamesNotInCostEmployeeHourForConstruction(this.selectedConstruction).subscribe((employeeNames) => {
      this.employeeNames = employeeNames;
    });
  }

  back() {
    this._location.back();
  }

  newCostEmployeeHour() {
    this.costEmployeeHour = { employeeId: this.selectedEmployee, constructionId: this.selectedConstruction, hourCost: this.hourCost } as CostEmployeeHourCreation;

    if (this.costEmployeeHour != null) {
      this.costEmployeeHourService.createCostEmployeeHour(this.costEmployeeHour).subscribe(newCostEmployeeHour => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Custo por Hora adicionado com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }

}
