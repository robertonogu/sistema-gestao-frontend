import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VacationSummary } from '../../api/vacationSummary';

@Injectable({
    providedIn: 'root'
})
export class VacationService {

    private vacationsUrl = `${environment.apiUrl}/vacations`;

    constructor(private http: HttpClient) { }

    getSummary(employeeId: number, year: number) : Observable<VacationSummary> {
        return this.http.get<VacationSummary>(`${this.vacationsUrl}/${employeeId}/${year}`);
    }

    updateCarriedOver(employeeId: number, year: number, carriedOverDays: number) : Observable<VacationSummary> {
        return this.http.put<VacationSummary>(`${this.vacationsUrl}/${employeeId}/${year}`, { carriedOverDays }, environment.httpOptions);
    }
}
