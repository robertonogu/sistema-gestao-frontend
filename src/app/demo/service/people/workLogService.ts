import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { WorkLog } from '../../api/workLog';
import { WorkLogCreation } from '../../data/model/worklogCreation.model';
import { WorkLogSummary } from '../../api/workLogSummary';

@Injectable({
    providedIn: 'root'
})
export class WorkLogService {

    private workLogsUrl = `${environment.apiUrl}/worklogs`;
    private externalSummaryUrl = `${environment.apiUrl}/worklogs/externalSummary/`;
    private internalSummaryUrl = `${environment.apiUrl}/worklogs/internalSummary/`;

    constructor(private http: HttpClient) { }

    getWorkLogs(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.workLogsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createWorkLog(worklog: WorkLogCreation) : Observable<WorkLog> {
        return this.http.post<WorkLog>(this.workLogsUrl, worklog, environment.httpOptions);
    }

    getExternalSummary(employeeId: number, year: number) : Observable<WorkLogSummary> {
        return this.http.get<WorkLogSummary>(this.externalSummaryUrl + employeeId + "?year=" + year);
    }

    getInternalSummary(employeeId: number, year: number) : Observable<WorkLogSummary> {
        return this.http.get<WorkLogSummary>(this.internalSummaryUrl + employeeId + "?year=" + year);
    }

}