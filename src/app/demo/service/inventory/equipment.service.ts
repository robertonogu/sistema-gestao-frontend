import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemName } from '../../api/itemName';
import { ObjectList } from '../../api/objectList';
import { Equipment } from '../../api/equipment';
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

    getEquipments(currentPage: number, pageSize: number): Observable<ObjectList> {
        let url = this.equipmentsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createEquipment(equipment: EquipmentCreation): Observable<Equipment> {
        return this.http.post<Equipment>(this.equipmentsUrl, equipment, environment.httpOptions);
    }

    deleteEquipment(equipmentId: number) {
        let url = this.equipmentsUrl + "/" + equipmentId;
        return this.http.delete(url);
    }

}
