import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Revenue } from '../../api/revenue';
import { RevenueCreation } from 'src/app/demo/data/model/revenueCreation.model';
import { RevenueEdit } from 'src/app/demo/data/model/revenueEdit.model';
import { RevenueList } from '../../api/revenueList';

@Injectable({
    providedIn: 'root'
})
export class RevenueService {

    private revenuesUrl = `${environment.apiUrl}/revenues`;
    private revenueByIdUrl = `${environment.apiUrl}/revenues/`;

    constructor(private http: HttpClient) { }

    getRevenues(currentPage: number, pageSize: number) : Observable<RevenueList> {
        let url = this.revenuesUrl + "?pageNo=" +  currentPage + "&pageSize=" + pageSize;
        return this.http.get<RevenueList>(url);
    }

    getRevenue(revenueId: number) : Observable<RevenueEdit> {
        let url = this.revenueByIdUrl + revenueId;
        return this.http.get<RevenueEdit>(url);
    }

    createRevenue(newRevenue: RevenueCreation) : Observable<Revenue> {
        return this.http.post<Revenue>(this.revenuesUrl, newRevenue, environment.httpOptions);
    }

    updateRevenue(revenueId: number, revenue: RevenueCreation) : Observable<Revenue> {
        let url = this.revenueByIdUrl + revenueId;
        return this.http.put<Revenue>(url, revenue, environment.httpOptions);
    }

}