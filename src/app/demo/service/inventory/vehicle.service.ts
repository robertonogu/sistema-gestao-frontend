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

    constructor(private http: HttpClient) { }

    getActiveVehicleNames() : Observable<ItemName[]> {
        return this.http.get<ItemName[]>(environment.inventory.vehicle.activeVehicleNamesUrl);
    }

    getVehicles(currentPage: number, pageSize: number) : Observable<ObjectList> {
        return this.http.get<ObjectList>(environment.inventory.vehicle.vehiclesUrl);
    }

    createVehicle(vehicle: VehicleCreation) : Observable<Vehicle> {
        return this.http.post<Vehicle>(environment.inventory.vehicle.vehiclesUrl, vehicle, environment.httpOptions);
    }
    
    updateVehicleStatus(vehicleId: number, isActive: boolean) : Observable<Vehicle> {
        const params = new HttpParams().set('isActive', isActive.toString());
        console.log(params)
        let url = environment.inventory.vehicle.updateVehicleStatus + vehicleId;
        return this.http.patch<Vehicle>(url, null, { params });
    }

    deleteVehicle(vehicleId: number) {
        let url = environment.inventory.vehicle.deleteVehicleUrl + vehicleId;
        return this.http.delete(url);
    }
    
}