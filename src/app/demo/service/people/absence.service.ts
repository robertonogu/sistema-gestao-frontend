import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { AbsenceCreation } from '../../data/model/absenceCreation.model';
import { Absence } from '../../api/absence';

@Injectable({
    providedIn: 'root'
})
export class AbsenceService {

    private absencesUrl = `${environment.apiUrl}/absences`;
    private deleteAbsenceUrl = `${environment.apiUrl}/absences/`;

    constructor(private http: HttpClient) { }

    getAbsences(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.absencesUrl + "?pageSize=" + pageSize + "&pageNo=" + currentPage;
        return this.http.get<ObjectList>(url);
    }

    createAbsence(newAbsence: AbsenceCreation) : Observable<Absence> {
        return this.http.post<Absence>(this.absencesUrl, newAbsence, environment.httpOptions);
    }

    deleteAbsence(absenceId: number) {
        let url = this.deleteAbsenceUrl + absenceId;
        return this.http.delete(url);
    }
}