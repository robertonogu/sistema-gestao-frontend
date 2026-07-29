import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemName } from '../../api/itemName';
import { ObjectList } from '../../api/objectList';
import { Vehicle } from '../../api/vehicle';
import { VehicleCreation } from '../../data/model/vehicleCreation.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    private activeVehicleNamesUrl = `${environment.apiUrl}/activeVehicleNames`;
    private vehiclesUrl = `${environment.apiUrl}/vehicles`;
    private updateVehicleStatusUrl = `${environment.apiUrl}/vehicles/status/`;
    private deleteVehicleUrl = `${environment.apiUrl}/vehicles/`;

    constructor(private http: HttpClient) { }

    getActiveVehicleNames() : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(this.activeVehicleNamesUrl);
    }

    getVehicles(currentPage: number, pageSize: number) : Observable<ObjectList> {
        return this.http.get<ObjectList>(this.vehiclesUrl);
    }

    createVehicle(vehicle: VehicleCreation) : Observable<Vehicle> {
        return this.http.post<Vehicle>(this.vehiclesUrl, vehicle, environment.httpOptions);
    }

    updateVehicleStatus(vehicleId: number, isActive: boolean) : Observable<Vehicle> {
        const params = new HttpParams().set('isActive', isActive.toString());
        console.log(params)
        let url = this.updateVehicleStatusUrl + vehicleId;
        return this.http.patch<Vehicle>(url, null, { params });
    }

    deleteVehicle(vehicleId: number) {
        let url = this.deleteVehicleUrl + vehicleId;
        return this.http.delete(url);
    }

}