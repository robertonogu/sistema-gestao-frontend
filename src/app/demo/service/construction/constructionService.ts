import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstructionNames } from '../../api/constructionNames';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { ItemName } from '../../api/itemName';
import { ConstructionCreation } from '../../data/model/constructionCreation.model';
import { Construction } from '../../api/construction';
import { ConstructionDetails } from '../../api/constructionDetails';
import { BudgetItem } from '../../api/budgetItem';

@Injectable({
    providedIn: 'root'
})
export class ConstructionService {

    private constructionNamesUrl = `${environment.apiUrl}/constructionNames`;
    private constructionNamesForClientUrl = `${environment.apiUrl}/constructionNames/`;
    private constructionsUrl = `${environment.apiUrl}/constructions`;
    private constructionsOngoingUrl = `${environment.apiUrl}/constructionsOngoing`;
    private budgetSubItemsForConstruction = `${environment.apiUrl}/constructions/budgetSubItems/`;
    private budgetItemsForConstruction = `${environment.apiUrl}/constructions/budgetTree/`;
    private constructionDetailsUrl = `${environment.apiUrl}/constructions/details/`;
    private markAsFavouriteUrl = `${environment.apiUrl}/constructions/favourite/`;

    constructor(private http: HttpClient) { }

    getConstructionNames() : Observable<ConstructionNames[]> {
        return this.http.get<ConstructionNames[]>(this.constructionNamesUrl);
    }

    getConstructionNamesForClient(clientId: number) : Observable<ConstructionNames[]> {
        let url = this.constructionNamesForClientUrl + clientId;
        return this.http.get<ConstructionNames[]>(url);
    }

    getConstructions(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.constructionsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    getConstructionsOnGoing(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.constructionsOngoingUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    getBudgetSubItemsForConstruction(constructionId: number) : Observable<ItemName[]> {
        let url = this.budgetSubItemsForConstruction + constructionId;
        return this.http.get<ItemName[]>(url);
    }

    getBudgetItemsForConstruction(constructionId: number) : Observable<BudgetItem[]> {
        let url = this.budgetItemsForConstruction + constructionId;
        return this.http.get<BudgetItem[]>(url);
    }

    getConstructionDetails(constructionId: number) : Observable<ConstructionDetails>{
        let url = this.constructionDetailsUrl + constructionId;
        return this.http.get<ConstructionDetails>(url);
      }

    createConstruction(construction: ConstructionCreation) : Observable<Construction> {
        return this.http.post<Construction>(this.constructionsUrl, construction, environment.httpOptions);
    }

    markAsFavourite(constructionId: number, isFavourite: boolean) : Observable<Construction> {
        const params = new HttpParams().set('isFavourite', isFavourite.toString());
        let url = this.markAsFavouriteUrl + constructionId;
        return this.http.patch<Construction>(url, null, { params });
    }

}