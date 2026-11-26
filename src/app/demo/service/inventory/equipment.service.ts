import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemName } from '../../api/itemName';
import { ObjectList } from '../../api/objectList';
import { Equipment, EquipmentImage } from '../../api/equipment';
import { EquipmentCreation } from '../../data/model/equipmentCreation.model';

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {

    private equipmentsUrl = `${environment.apiUrl}/equipments`;
    private activeEquipmentNamesUrl = `${environment.apiUrl}/activeEquipmentNames`;

    constructor(private http: HttpClient) { }

    getActiveEquipmentNames(): Observable<ItemName[]> {
        return this.http.get<ItemName[]>(this.activeEquipmentNamesUrl);
    }

    getEquipments(currentPage: number, pageSize: number, category?: string): Observable<ObjectList> {
        let url = this.equipmentsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        if (category) url += "&category=" + category;
        return this.http.get<ObjectList>(url);
    }

    createEquipment(equipment: EquipmentCreation): Observable<Equipment> {
        return this.http.post<Equipment>(this.equipmentsUrl, equipment, environment.httpOptions);
    }

    getEquipment(equipmentId: number): Observable<any> {
        return this.http.get<any>(this.equipmentsUrl + "/" + equipmentId);
    }

    updateEquipment(equipmentId: number, equipment: EquipmentCreation): Observable<Equipment> {
        return this.http.put<Equipment>(this.equipmentsUrl + "/" + equipmentId, equipment, environment.httpOptions);
    }

    uploadPurchaseDocument(equipmentId: number, file: File): Observable<Equipment> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<Equipment>(`${this.equipmentsUrl}/${equipmentId}/purchase-document`, formData);
    }

    deletePurchaseDocument(equipmentId: number): Observable<Equipment> {
        return this.http.delete<Equipment>(`${this.equipmentsUrl}/${equipmentId}/purchase-document`);
    }

    getImages(equipmentId: number): Observable<EquipmentImage[]> {
        return this.http.get<EquipmentImage[]>(`${this.equipmentsUrl}/${equipmentId}/images`);
    }

    addImages(equipmentId: number, files: File[]): Observable<EquipmentImage[]> {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return this.http.post<EquipmentImage[]>(`${this.equipmentsUrl}/${equipmentId}/images`, formData);
    }

    deleteImage(equipmentId: number, imageId: number): Observable<void> {
        return this.http.delete<void>(`${this.equipmentsUrl}/${equipmentId}/images/${imageId}`);
    }

    deleteEquipment(equipmentId: number) {
        let url = this.equipmentsUrl + "/" + equipmentId;
        return this.http.delete(url);
    }

}
