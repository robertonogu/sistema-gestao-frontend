import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HolidayService {

    constructor(private http: HttpClient) { }

    getHolidays(): Observable<any> {
        return this.http.get<any>("http://services.sapo.pt/Holiday/GetNationalHolidays?year=2024");
    }
}