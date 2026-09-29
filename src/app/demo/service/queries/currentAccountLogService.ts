import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObjectList } from '../../api/objectList';
import { environment } from 'src/environments/environment';

export interface CurrentAccountLogFilters {
    dateFrom?: Date;
    dateTo?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class CurrentAccountLogService {

    private currentAccountLogsUrl = `${environment.apiUrl}/currentAccountLogs/`;

    constructor(private http: HttpClient) { }

    getCurrentAccountLogs(currentPage: number, pageSize: number, originId: number, filters?: CurrentAccountLogFilters) : Observable<ObjectList> {
        let url = this.currentAccountLogsUrl + originId + "?pageNo=" + currentPage + "&pageSize=" + pageSize + this.filterParams(filters);
        return this.http.get<ObjectList>(url);
    }

    private filterParams(filters?: CurrentAccountLogFilters): string {
        let params = "";
        if (filters?.dateFrom) params += "&dateFrom=" + this.formatDate(filters.dateFrom);
        if (filters?.dateTo) params += "&dateTo=" + this.formatDate(filters.dateTo);
        return params;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

}
