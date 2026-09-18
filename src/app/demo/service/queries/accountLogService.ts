import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObjectList } from '../../api/objectList';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AccountLogService {

    private accountLogsUrl = `${environment.apiUrl}/accountLogs/`;
    private cashAccountLogsUrl = `${environment.apiUrl}/cashAccountLogs`;

    constructor(private http: HttpClient) { }

    getAccountLogs(accountId: number, currentPage: number, pageSize: number, movementType?: string) : Observable<ObjectList> {
        let url = this.accountLogsUrl + accountId + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        if (movementType) url += "&movementType=" + movementType;
        return this.http.get<ObjectList>(url);
    }

    getCashAccountLogs(currentPage: number, pageSize: number, movementType?: string) : Observable<ObjectList> {
        let url = this.cashAccountLogsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        if (movementType) url += "&movementType=" + movementType;
        return this.http.get<ObjectList>(url);
    }

}