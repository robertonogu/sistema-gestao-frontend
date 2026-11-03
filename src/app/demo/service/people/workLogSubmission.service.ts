import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BudgetItem } from '../../api/budgetItem';
import { ConstructionNames } from '../../api/constructionNames';
import { WorkLogSubmission, WorkLogSubmissionInput } from '../../api/workLogSubmission';

@Injectable({
    providedIn: 'root'
})
export class WorkLogSubmissionService {

    private meUrl = `${environment.apiUrl}/me`;
    private submissionsUrl = `${environment.apiUrl}/workLogSubmissions`;

    readonly pendingChanged = new Subject<void>();

    constructor(private http: HttpClient) { }

    getMyConstructions(): Observable<ConstructionNames[]> {
        return this.http.get<ConstructionNames[]>(`${this.meUrl}/constructions`);
    }

    getMyBudgetTree(constructionId: number): Observable<BudgetItem[]> {
        return this.http.get<BudgetItem[]>(`${this.meUrl}/constructions/${constructionId}/budgetTree`);
    }

    getMySubmissions(days: number = 30): Observable<WorkLogSubmission[]> {
        return this.http.get<WorkLogSubmission[]>(`${this.meUrl}/workLogSubmissions?days=${days}`);
    }

    createMySubmission(input: WorkLogSubmissionInput): Observable<WorkLogSubmission> {
        return this.http.post<WorkLogSubmission>(`${this.meUrl}/workLogSubmissions`, input, environment.httpOptions);
    }

    updateMySubmission(submissionId: number, input: WorkLogSubmissionInput): Observable<WorkLogSubmission> {
        return this.http.put<WorkLogSubmission>(`${this.meUrl}/workLogSubmissions/${submissionId}`, input, environment.httpOptions);
    }

    deleteMySubmission(submissionId: number) {
        return this.http.delete(`${this.meUrl}/workLogSubmissions/${submissionId}`);
    }

    getPending(): Observable<WorkLogSubmission[]> {
        return this.http.get<WorkLogSubmission[]>(`${this.submissionsUrl}/pending`);
    }

    countPending(): Observable<number> {
        return this.http.get<number>(`${this.submissionsUrl}/pending/count`);
    }

    approve(submissionId: number, corrections: WorkLogSubmissionInput): Observable<WorkLogSubmission> {
        return this.http.post<WorkLogSubmission>(`${this.submissionsUrl}/${submissionId}/approve`, corrections, environment.httpOptions)
            .pipe(tap(() => this.pendingChanged.next()));
    }

    reject(submissionId: number, reason: string): Observable<WorkLogSubmission> {
        return this.http.post<WorkLogSubmission>(`${this.submissionsUrl}/${submissionId}/reject`, { reason }, environment.httpOptions)
            .pipe(tap(() => this.pendingChanged.next()));
    }
}
