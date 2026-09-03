import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstructionNames } from '../../api/constructionNames';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { ItemName } from '../../api/itemName';
import { Construction as ConstructionInput } from '../../data/model/construction.model';
import { Construction } from '../../api/construction';
import { ConstructionDetails } from '../../api/constructionDetails';
import { BudgetItem } from '../../api/budgetItem';
import { MaterialAllocationDetail } from '../../data/model/materialAllocationDetail.model';
import { WorkLogDetail } from '../../data/model/workLogDetail.model';
import { MaterialExport } from '../../api/materialExport';

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
    private constructionEditUrl = `${environment.apiUrl}/constructions/edit/`;
    private markAsFavouriteUrl = `${environment.apiUrl}/constructions/favourite/`;
    private budgetItemsUrl = `${environment.apiUrl}/budgetItems/`;

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

    getMaterialsExport(constructionId: number) : Observable<MaterialExport[]> {
        let url = this.constructionDetailsUrl + constructionId + "/materialsExport";
        return this.http.get<MaterialExport[]>(url);
    }

    createConstruction(construction: ConstructionInput, image?: File) : Observable<Construction> {
        return this.http.post<Construction>(this.constructionsUrl, this.buildConstructionFormData(construction, image));
    }

    getConstructionForEdit(constructionId: number) : Observable<ConstructionInput> {
        let url = this.constructionEditUrl + constructionId;
        return this.http.get<ConstructionInput>(url);
    }

    updateConstruction(constructionId: number, construction: ConstructionInput, image?: File) : Observable<Construction> {
        let url = this.constructionsUrl + "/" + constructionId;
        return this.http.put<Construction>(url, this.buildConstructionFormData(construction, image));
    }

    private buildConstructionFormData(construction: ConstructionInput, image?: File) : FormData {
        const formData = new FormData();
        formData.append('construction', new Blob([JSON.stringify(construction)], { type: 'application/json' }));
        if (image) {
            formData.append('image', image, image.name);
        }
        return formData;
    }

    markAsFavourite(constructionId: number, isFavourite: boolean) : Observable<Construction> {
        const params = new HttpParams().set('isFavourite', isFavourite.toString());
        let url = this.markAsFavouriteUrl + constructionId;
        return this.http.patch<Construction>(url, null, { params });
    }

    getMaterialDetails(budgetItemId: number) : Observable<MaterialAllocationDetail[]> {
        let url = this.budgetItemsUrl + budgetItemId + "/materialDetails";
        return this.http.get<MaterialAllocationDetail[]>(url);
    }

    getWorkLogDetails(budgetItemId: number) : Observable<WorkLogDetail[]> {
        let url = this.budgetItemsUrl + budgetItemId + "/workLogDetails";
        return this.http.get<WorkLogDetail[]>(url);
    }

}