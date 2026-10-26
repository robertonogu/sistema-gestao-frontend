import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Creditor, CreditorCreation } from '../../api/creditor';
import { ItemName } from '../../api/itemName';

@Injectable({
    providedIn: 'root'
})
export class CreditorService {

    private creditorsUrl = `${environment.apiUrl}/creditors`;

    constructor(private http: HttpClient) { }

    // Credores com o que a empresa deve a cada um
    getCreditors() : Observable<Creditor[]> {
        return this.http.get<Creditor[]>(this.creditorsUrl);
    }

    getCreditorNames() : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(this.creditorsUrl + "/names");
    }

    createCreditor(creditor: CreditorCreation) : Observable<Creditor> {
        return this.http.post<Creditor>(this.creditorsUrl, creditor, environment.httpOptions);
    }

    updateCreditor(creditorId: number, creditor: CreditorCreation) : Observable<Creditor> {
        return this.http.put<Creditor>(this.creditorsUrl + "/" + creditorId, creditor, environment.httpOptions);
    }

    deleteCreditor(creditorId: number) {
        return this.http.delete(this.creditorsUrl + "/" + creditorId);
    }
}
