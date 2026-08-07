import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Employee } from 'src/app/demo/api/employee';
import { EmployeeStatus } from 'src/app/demo/data/enum/employeeStatus';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';

@Component({
  templateUrl: './list-employees.component.html',
  providers: [EmployeeService, ConfirmationService, MessageService]
})

export class ListEmployeesComponent {

  employeeStatus = EmployeeStatus;

  loading: boolean = true;
  totalRecords: number = 0;
  employees!: Employee[];
  displayedEmployees: Employee[] = [];

  currentPage: number = 0;
  pageSize: number = 20;

  selectedStatusFilter: EmployeeStatus[] = [EmployeeStatus.ACTIVE];

  employeeDialog: boolean = false;
  submitted: boolean = false;
  employee: Partial<Employee> = {};

  constructor(
    private employeeService: EmployeeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  nextPage(event: any) {
    this.loading = true;

    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;

    this.employeeService.getEmployees(this.currentPage, this.pageSize).subscribe((employees) => {
      this.employees = employees.objectList;
      this.totalRecords = employees.totalElements;
      this.loading = false;
      this.applyStatusFilter();
    });
  }

  isStatusChecked(status: EmployeeStatus): boolean {
    return this.selectedStatusFilter.includes(status);
  }

  toggleStatusFilter(status: EmployeeStatus) {
    this.selectedStatusFilter = this.isStatusChecked(status)
      ? this.selectedStatusFilter.filter((s) => s !== status)
      : [...this.selectedStatusFilter, status];

    this.applyStatusFilter();
  }

  applyStatusFilter() {
    this.displayedEmployees = this.selectedStatusFilter.length
      ? this.employees.filter((employee) => this.selectedStatusFilter.includes(employee.statusEmployee))
      : this.employees;
  }

  openNew() {
    this.employee = { internal: false };
    this.submitted = false;
    this.employeeDialog = true;
  }

  editEmployee(employee: Employee) {
    this.employee = { ...employee };
    this.submitted = false;
    this.employeeDialog = true;
  }

  hideDialog() {
    this.employeeDialog = false;
    this.submitted = false;
  }

  saveEmployee() {
    this.submitted = true;

    if (this.employee.name?.trim()) {
      const employeePayload = {
        name: this.employee.name,
        nif: this.employee.nif,
        baseSalary: this.employee.baseSalary,
        allowance: this.employee.allowance,
        foodAllowance: this.employee.foodAllowance,
        healthInsurance: this.employee.healthInsurance,
        internal: this.employee.internal ?? false,
        statusEmployee: this.employee.originId ? this.employee.statusEmployee : EmployeeStatus.ACTIVE,
      } as Employee;

      if (this.employee.originId) {
        this.employeeService.updateEmployee(this.employee.originId, employeePayload).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário atualizado com sucesso.' });
          this.employeeDialog = false;
          this.employee = {};
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      } else {
        this.employeeService.createEmployee(employeePayload).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário registado com sucesso.' });
          this.employeeDialog = false;
          this.employee = {};
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      }
    }
  }

  updateStatus(employee: Employee) {
    const isActive = employee.statusEmployee !== EmployeeStatus.ACTIVE;

    this.employeeService.updateEmployeeStatus(employee.originId, isActive).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Estado de funcionário atualizado.' });
      this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
    });
  }

  deleteEmployee(employee: Employee) {
    this.confirmationService.confirm({
      header: 'Tem a certeza que pretende eliminar o funcionário ' + employee.name + '?',
      message: 'Confirme para prosseguir.',
      accept: () => {
        this.employeeService.deleteEmployee(employee.originId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário eliminado com sucesso.' });
          this.nextPage({ first: this.currentPage * this.pageSize, rows: this.pageSize });
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejeição', detail: 'Operação rejeitada.', life: 3000 });
      }
    });
  }
}
