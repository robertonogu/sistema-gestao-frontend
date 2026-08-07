import { HttpClient, HttpParams } from '@angular/common/http';
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

    private employeesUrl = `${environment.apiUrl}/employees?`;
    private employeeNamesUrl = `${environment.apiUrl}/employeeNames`;
    private employeeNamesNotInCostEmployeeHourForConstructionUrl = `${environment.apiUrl}/employeeNamesNotInCostEmployeeHourForConstruction/`;
    private employeeNamesInCostEmployeeHourForConstructionUrl = `${environment.apiUrl}/employeeNamesInCostEmployeeHourForConstruction/`;
    private createEmployeeUrl = `${environment.apiUrl}/employees`;
    private updateEmployeeStatusUrl = `${environment.apiUrl}/employees/status/`;
    private deleteEmployeeUrl = `${environment.apiUrl}/employees/`;

    constructor(private http: HttpClient) { }

    getEmployees(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.employeesUrl + "pageSize=" + pageSize + "&pageNo=" + currentPage + "&sortBy=baseSalary&sortDirection=DESC";
        return this.http.get<ObjectList>(url);
    }

    getEmployeeNames() : Observable<ItemName[]> {
        let url = this.employeeNamesUrl;
        return this.http.get<ItemName[]>(url);
    }

    getEmployeeNamesNotInCostEmployeeHourForConstruction(constructionId: number) : Observable<ItemName[]> {
        let url = this.employeeNamesNotInCostEmployeeHourForConstructionUrl + constructionId;
        return this.http.get<ItemName[]>(url);
    }

    getEmployeeNamesInCostEmployeeHourForConstruction(constructionId: number) : Observable<ItemName[]> {
        let url = this.employeeNamesInCostEmployeeHourForConstructionUrl + constructionId;
        return this.http.get<ItemName[]>(url);
    }

    createEmployee(employee: Employee) : Observable<Employee> {
        return this.http.post<Employee>(this.createEmployeeUrl, employee, environment.httpOptions);
    }

    updateEmployee(employeeId: number, employee: Employee) : Observable<Employee> {
        let url = this.createEmployeeUrl + "/" + employeeId;
        return this.http.put<Employee>(url, employee, environment.httpOptions);
    }

    updateEmployeeStatus(employeeId: number, isActive: boolean) : Observable<Employee> {
        const params = new HttpParams().set('isActive', isActive);
        let url = this.updateEmployeeStatusUrl + employeeId;
        return this.http.patch<Employee>(url, null, { params });
    }

    deleteEmployee(employeeId: number) {
        let url = this.deleteEmployeeUrl + employeeId;
        return this.http.delete(url);
    }
}