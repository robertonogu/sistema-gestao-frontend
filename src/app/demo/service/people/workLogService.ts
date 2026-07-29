import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { WorkLog } from '../../api/workLog';
import { WorkLogCreation } from '../../data/model/worklogCreation.model';
import { TimeMap } from '../../api/timemap';

@Injectable({
    providedIn: 'root'
})
export class WorkLogService {

    private workLogsUrl = `${environment.apiUrl}/worklogs`;
    private timemapUrl = `${environment.apiUrl}/worklogs/summary/`;

    constructor(private http: HttpClient) { }

    getWorkLogs(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.workLogsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createWorkLog(worklog: WorkLogCreation) : Observable<WorkLog> {
        return this.http.post<WorkLog>(this.workLogsUrl, worklog, environment.httpOptions);
    }

    getTimeMap(employeeId: number) : Observable<TimeMap[]> {
        let url = this.timemapUrl + employeeId;
        return this.http.get<TimeMap[]>(url);
    }

}