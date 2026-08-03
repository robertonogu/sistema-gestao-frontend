import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface NationalHoliday {
    name: string;
    date: string;
}

@Injectable({
    providedIn: 'root'
})
export class HolidayService {

    constructor(private http: HttpClient) { }

    getHolidays(year: number): Observable<NationalHoliday[]> {
        return this.http.get(
            "http://services.sapo.pt/Holiday/GetNationalHolidays?year=" + year,
            { responseType: 'text' }
        ).pipe(
            map(xml => this.parseHolidays(xml))
        );
    }

    private parseHolidays(xml: string): NationalHoliday[] {
        const doc = new DOMParser().parseFromString(xml, 'application/xml');
        return Array.from(doc.getElementsByTagName('Holiday')).map(holiday => ({
            name: holiday.getElementsByTagName('Name')[0]?.textContent ?? '',
            date: holiday.getElementsByTagName('Date')[0]?.textContent ?? '',
        }));
    }
}
