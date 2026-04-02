import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstructionNames } from '../../api/constructionNames';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { CostEmployeeHourCreation } from '../../data/model/costEmployeeHourCreation.model';
import { CostEmployeeHour } from '../../api/costEmployeeHour';

@Injectable({
    providedIn: 'root'
})
export class CostEmployeeHourService {

    constructor(private http: HttpClient) { }

    getCostEmployeeHours(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.construction.costEmployeeHour.costEmployeeHoursUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createCostEmployeeHour(costEmployeeHour: CostEmployeeHourCreation) : Observable<CostEmployeeHour> {
        return this.http.post<CostEmployeeHour>(environment.construction.costEmployeeHour.createCostEmployeeHoursUrl, costEmployeeHour, environment.httpOptions);
    }

    deleteCostEmployeeHour(costEmployeeHourId: number) {
        let url = environment.construction.costEmployeeHour.deleteCostEmployeeHoursUrl + costEmployeeHourId;
        return this.http.delete(url);
    }

}