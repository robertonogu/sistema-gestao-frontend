import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Financer, FinancerCreation } from '../../api/financer';
import { ItemName } from '../../api/itemName';

@Injectable({
    providedIn: 'root'
})
export class FinancerService {

    private financersUrl = `${environment.apiUrl}/financers`;

    constructor(private http: HttpClient) { }

    // Financiadores com o que a empresa deve a cada um
    getFinancers() : Observable<Financer[]> {
        return this.http.get<Financer[]>(this.financersUrl);
    }

    getFinancerNames() : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(this.financersUrl + "/names");
    }

    createFinancer(financer: FinancerCreation) : Observable<Financer> {
        return this.http.post<Financer>(this.financersUrl, financer, environment.httpOptions);
    }

    updateFinancer(financerId: number, financer: FinancerCreation) : Observable<Financer> {
        return this.http.put<Financer>(this.financersUrl + "/" + financerId, financer, environment.httpOptions);
    }

    changeStatus(financerId: number, isActive: boolean) : Observable<Financer> {
        return this.http.patch<Financer>(this.financersUrl + "/status/" + financerId + "?isActive=" + isActive, {});
    }

    deleteFinancer(financerId: number) {
        return this.http.delete(this.financersUrl + "/" + financerId);
    }
}
