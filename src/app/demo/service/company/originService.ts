import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Origin } from '../../api/origin';
import { environment } from 'src/environments/environment';
import { ItemName } from '../../api/itemName';

@Injectable({
    providedIn: 'root'
})
export class OriginService {

    private originsGroupedUrl = `${environment.apiUrl}/originsGrouped`;
    private originNamesUrl = `${environment.apiUrl}/originNames`;

    constructor(private http: HttpClient) { }

    getOriginsGrouped() : Observable<Origin[]> {
        return this.http.get<Origin[]>(this.originsGroupedUrl);
    }

    getOriginNames() : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(this.originNamesUrl);
    }
}