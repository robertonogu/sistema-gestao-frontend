import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObjectList } from '../../api/objectList';
import { AccountLog } from '../../api/accountLogs';
import { environment } from 'src/environments/environment';

export interface AccountLogFilters {
    movementType?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class AccountLogService {

    private accountLogsUrl = `${environment.apiUrl}/accountLogs/`;
    private cashAccountLogsUrl = `${environment.apiUrl}/cashAccountLogs`;

    constructor(private http: HttpClient) { }

    getAccountLogs(accountId: number, currentPage: number, pageSize: number, filters?: AccountLogFilters) : Observable<ObjectList> {
        const url = this.accountLogsUrl + accountId + "?pageNo=" + currentPage + "&pageSize=" + pageSize + this.filterParams(filters);
        return this.http.get<ObjectList>(url);
    }

    getCashAccountLogs(currentPage: number, pageSize: number, filters?: AccountLogFilters) : Observable<ObjectList> {
        const url = this.cashAccountLogsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize + this.filterParams(filters);
        return this.http.get<ObjectList>(url);
    }

    // Every log matching the filters, without pagination (PDF/Excel export)
    exportAccountLogs(accountId: number, filters?: AccountLogFilters) : Observable<AccountLog[]> {
        const url = this.accountLogsUrl + accountId + "/export?" + this.filterParams(filters).substring(1);
        return this.http.get<AccountLog[]>(url);
    }

    exportCashAccountLogs(filters?: AccountLogFilters) : Observable<AccountLog[]> {
        const url = this.cashAccountLogsUrl + "/export?" + this.filterParams(filters).substring(1);
        return this.http.get<AccountLog[]>(url);
    }

    private filterParams(filters?: AccountLogFilters): string {
        let params = "";
        if (filters?.movementType) params += "&movementType=" + filters.movementType;
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
