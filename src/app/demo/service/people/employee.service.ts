import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../../api/employee';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { ItemName } from '../../api/itemName';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    constructor(private http: HttpClient) { }

    getEmployees(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.people.employee.employeesUrl + "pageSize=" + pageSize + "&pageNo=" + currentPage + "&sortBy=baseSalary&sortDirection=DESC";
        return this.http.get<ObjectList>(url);
    }

    getEmployeeNames() : Observable<ItemName[]> {
        let url = environment.people.employee.employeeNamesUrl;
        return this.http.get<ItemName[]>(url);
    }

    getEmployeeNamesNotInCostEmployeeHourForConstruction(constructionId: number) : Observable<ItemName[]> {
        let url = environment.people.employee.employeeNamesNotInCostEmployeeHourForConstructionUrl + constructionId;
        return this.http.get<ItemName[]>(url);
    }

    getEmployeeNamesInCostEmployeeHourForConstruction(constructionId: number) : Observable<ItemName[]> {
        let url = environment.people.employee.employeeNamesInCostEmployeeHourForConstructionUrl + constructionId;
        return this.http.get<ItemName[]>(url);
    }
    
    createEmployee(employee: Employee) : Observable<Employee> {
        return this.http.post<Employee>(environment.people.employee.createEmployeeUrl, employee, environment.httpOptions);
    }
}