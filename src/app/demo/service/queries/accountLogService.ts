import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObjectList } from '../../api/objectList';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AccountLogService {

    constructor(private http: HttpClient) { }

    getAccountLogs(accountId: number, currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.queries.accountLogs.accountLogsUrl + accountId + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    getCashAccountLogs(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.queries.cashLogs.cashAccountLogsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

}