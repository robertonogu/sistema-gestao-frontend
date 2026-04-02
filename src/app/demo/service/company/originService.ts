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

    constructor(private http: HttpClient) { }

    getOriginsGrouped() : Observable<Origin[]> {
        return this.http.get<Origin[]>(environment.company.origin.originsGroupedUrl);
    }

    getOriginNames() : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(environment.company.origin.originNamesUrl);
    }
}