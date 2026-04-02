import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Employee } from 'src/app/demo/api/employee';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './create-employee.component.html',
  providers: [EmployeeService, MessageService]
})

export class CreateEmployeeComponent {

  constructor(
    private employeeService: EmployeeService, 
    private messageService: MessageService,
    private _location: Location
  ) { }

  back() {
    this._location.back();
  }

  createEmployee() {
    /*this.employeeService.createEmployee({
      name: name,
      nif: nif,
      baseSalary: baseSalary,
      allowance: allowance,
      foodAllowance: foodAllowance,
      healthInsurance: healthInsurance,
    } as Employee)
    .subscribe(employee => {
      (employee === undefined ? this.showError() : this.showSuccess() )
    });*/
  }

  delete() {
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Funcionário registado.' });
  }

  showError() {
    this.messageService.add({ severity: 'danger', summary: 'Erro', detail: 'Funcionário não registado.' });
  }
}
