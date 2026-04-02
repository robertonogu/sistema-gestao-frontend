import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Employee } from 'src/app/demo/api/employee';
import { EmployeeService } from 'src/app/demo/service/people/employee.service';

@Component({
  templateUrl: './list-employees.component.html',
  providers: [EmployeeService]
})

export class ListEmployeesComponent implements OnInit {

  loading: boolean = true;
  totalRecords: number = 0;
  employees!: Employee[];

  currentPage: number = 0;
  pageSize: number = 5;

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit() {
    this.employeeService.getEmployees(this.currentPage, this.pageSize).subscribe((employees) => {
      this.employees = employees.objectList;
      this.totalRecords = employees.totalElements;
    });
  }

  nextPage(event: any) {
    this.loading = true;
    
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    
    this.employeeService.getEmployees(this.currentPage, this.pageSize).subscribe((employees) => {
      this.employees = employees.objectList;
      this.totalRecords = employees.totalElements;
      this.loading = false;
    });
  }


  newEmployee() {
    this.router.navigate(['./people/create-employee']);
  }

}
