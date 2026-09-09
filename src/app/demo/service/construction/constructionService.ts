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
import { WorkLogDetailsResponse } from '../../data/model/workLogDetail.model';
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

    // ===== Detalhes por budget item =====

    getMaterialDetails(budgetItemId: number, pageNo: number, pageSize: number) : Observable<ObjectList> {
        return this.http.get<ObjectList>(`${this.budgetItemsUrl}${budgetItemId}/materialDetails?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    getExternalServiceDetails(budgetItemId: number, pageNo: number, pageSize: number) : Observable<ObjectList> {
        return this.http.get<ObjectList>(`${this.budgetItemsUrl}${budgetItemId}/externalServiceDetails?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    getWorkLogDetails(budgetItemId: number, pageNo: number, pageSize: number, employeeId?: number, subItemId?: number) : Observable<WorkLogDetailsResponse> {
        let url = `${this.budgetItemsUrl}${budgetItemId}/workLogDetails?pageNo=${pageNo}&pageSize=${pageSize}`;
        if (employeeId != null) url += "&employeeId=" + employeeId;
        if (subItemId != null) url += "&subItemId=" + subItemId;
        return this.http.get<WorkLogDetailsResponse>(url);
    }

    getWorkLogEmployees(budgetItemId: number) : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(`${this.budgetItemsUrl}${budgetItemId}/workLogEmployees`);
    }

    getWorkLogSubItems(budgetItemId: number) : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(`${this.budgetItemsUrl}${budgetItemId}/workLogSubItems`);
    }

    // ===== Detalhes ao nível da obra =====

    getConstructionMaterialDetails(constructionId: number, pageNo: number, pageSize: number) : Observable<ObjectList> {
        return this.http.get<ObjectList>(`${this.constructionsUrl}/${constructionId}/materialDetails?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    getConstructionExternalServiceDetails(constructionId: number, pageNo: number, pageSize: number) : Observable<ObjectList> {
        return this.http.get<ObjectList>(`${this.constructionsUrl}/${constructionId}/externalServiceDetails?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    getConstructionWorkLogDetails(constructionId: number, pageNo: number, pageSize: number, employeeId?: number, budgetItemId?: number) : Observable<WorkLogDetailsResponse> {
        let url = `${this.constructionsUrl}/${constructionId}/workLogDetails?pageNo=${pageNo}&pageSize=${pageSize}`;
        if (employeeId != null) url += "&employeeId=" + employeeId;
        if (budgetItemId != null) url += "&budgetItemId=" + budgetItemId;
        return this.http.get<WorkLogDetailsResponse>(url);
    }

    getConstructionWorkLogEmployees(constructionId: number) : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(`${this.constructionsUrl}/${constructionId}/workLogEmployees`);
    }

    getConstructionWorkLogSubItems(constructionId: number) : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(`${this.constructionsUrl}/${constructionId}/workLogSubItems`);
    }

}