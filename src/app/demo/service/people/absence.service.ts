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

    constructor(private http: HttpClient) { }

    getAbsences(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.people.absence.absencesUrl + "?pageSize=" + pageSize + "&pageNo=" + currentPage;
        return this.http.get<ObjectList>(url);
    }
    
    createAbsence(newAbsence: AbsenceCreation) : Observable<Absence> {
        return this.http.post<Absence>(environment.people.absence.absencesUrl, newAbsence, environment.httpOptions);
    }

    deleteAbsence(absenceId: number) {
        let url = environment.people.absence.deleteAbsence + absenceId;
        return this.http.delete(url);
    }
}