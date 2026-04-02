import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObjectList } from '../../api/objectList';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CurrentAccountLogService {

    constructor(private http: HttpClient) { }

    getCurrentAccountLogs(currentPage: number, pageSize: number, originId: number) : Observable<ObjectList> {
        let url = environment.queries.currentAccountLogs.currentAccountLogsUrl + originId + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

}