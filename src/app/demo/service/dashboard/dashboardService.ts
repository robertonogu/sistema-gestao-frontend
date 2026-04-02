import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardData } from '../../api/dashboardData';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private http: HttpClient) { }

    getDashboardData() : Observable<DashboardData> {
        const params = new HttpParams().set('year', "2025");

        return this.http.get<DashboardData>(
            environment.dashboard.dashboardDataUrl,
            { params }
        );
    }
    
}