import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ItemName } from 'src/app/demo/api/itemName';
import { SaleCreation } from 'src/app/demo/api/saleCreation';
import { AbsenceType } from 'src/app/demo/data/enum/absenceType';
import { AbsenceCreation } from 'src/app/demo/data/model/absenceCreation.model';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { AbsenceService } from 'src/app/demo/service/people/absence.service';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';
import { SaleService } from 'src/app/demo/service/transactions/saleService';

@Component({
  templateUrl: './create-absence.component.html',
  providers: [MessageService]
})
export class CreateAbsenceComponent {

  employeeNames!: ItemName[];
  absenceTypes = AbsenceType;

  date!: Date[];
  hours!: number;
  selectedAbsenceType!: AbsenceType;
  selectedEmployee!: number;

  absence!: AbsenceCreation;

  AbsenceType: any = AbsenceType;

  constructor(
    private employeeService: EmployeeService,
    private absenceService: AbsenceService, 
    private _location: Location,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.employeeService.getEmployeeNames().subscribe((employeeNames) => {
      this.employeeNames = employeeNames;
    });
  }

  back() {
    this._location.back();
  }

  newAbsence() {
    if (this.date[1] == null && !this.hours) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro no campo horas.' });
    }
  
    this.absence = { employeeId: this.selectedEmployee, absenceType: this.selectedAbsenceType, initialDate: this.date[0], finalDate: this.date[1], hours: this.hours } as AbsenceCreation;

    if (this.absence != null) {
      this.absenceService.createAbsence(this.absence).subscribe(newAbsence => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ausência adicionada com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
