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

@Injectable({
    providedIn: 'root'
})
export class ConstructionService {

    constructor(private http: HttpClient) { }

    getConstructionNames() : Observable<ConstructionNames[]> {
        return this.http.get<ConstructionNames[]>(environment.construction.construction.constructionNamesUrl);
    }

    getConstructionNamesForClient(clientId: number) : Observable<ConstructionNames[]> {
        let url = environment.construction.construction.constructionNamesForClientUrl + clientId;
        return this.http.get<ConstructionNames[]>(url);
    }

    getConstructions(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.construction.construction.constructionsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    getConstructionsOnGoing(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.construction.construction.constructionsOngoingUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }
    
    getBudgetSubItemsForConstruction(constructionId: number) : Observable<ItemName[]> {
        let url = environment.construction.construction.budgetSubItemsForConstruction + constructionId;
        return this.http.get<ItemName[]>(url);
    }

    getConstructionDetails(constructionId: number) : Observable<ConstructionDetails>{
        let url = environment.construction.construction.constructionDetailsUrl + constructionId;
        return this.http.get<ConstructionDetails>(url);
      }

    createConstruction(construction: ConstructionCreation) : Observable<Construction> {
        return this.http.post<Construction>(environment.construction.construction.constructionsUrl, construction, environment.httpOptions);
    }

    markAsFavourite(constructionId: number, isFavourite: boolean) : Observable<Construction> {
        const params = new HttpParams().set('isFavourite', isFavourite.toString());
        let url = environment.construction.construction.markAsFavouriteUrl + constructionId;
        return this.http.patch<Construction>(url, null, { params });
    }
    
}