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

    // activeOnly: sem os credores inativos (para escolher numa despesa/pagamento novo)
    getCreditorNames(activeOnly: boolean = false) : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(this.creditorsUrl + "/names?activeOnly=" + activeOnly);
    }

    createCreditor(creditor: CreditorCreation) : Observable<Creditor> {
        return this.http.post<Creditor>(this.creditorsUrl, creditor, environment.httpOptions);
    }

    updateCreditor(creditorId: number, creditor: CreditorCreation) : Observable<Creditor> {
        return this.http.put<Creditor>(this.creditorsUrl + "/" + creditorId, creditor, environment.httpOptions);
    }

    changeStatus(creditorId: number, isActive: boolean) : Observable<Creditor> {
        return this.http.patch<Creditor>(this.creditorsUrl + "/status/" + creditorId + "?isActive=" + isActive, {});
    }

    deleteCreditor(creditorId: number) {
        return this.http.delete(this.creditorsUrl + "/" + creditorId);
    }
}
