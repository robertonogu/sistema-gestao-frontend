import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Origin } from '../../api/origin';
import { environment } from 'src/environments/environment';
import { ItemName } from '../../api/itemName';
import { OriginName } from '../../api/originType';

@Injectable({
    providedIn: 'root'
})
export class OriginService {

    private originsGroupedUrl = `${environment.apiUrl}/originsGrouped`;
    private originNamesUrl = `${environment.apiUrl}/originNames`;

    constructor(private http: HttpClient) { }

    getOriginsGrouped(activeOnly: boolean = false) : Observable<Origin[]> {
        return this.http.get<Origin[]>(this.originsGroupedUrl + "?activeOnly=" + activeOnly);
    }

    getOriginNames() : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(this.originNamesUrl);
    }

    getOriginNamesWithExpenses() : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(this.originNamesUrl + "/withExpenses");
    }

    getOriginNamesWithPayments() : Observable<OriginName[]> {
        return this.http.get<OriginName[]>(this.originNamesUrl + "/withPayments");
    }
}