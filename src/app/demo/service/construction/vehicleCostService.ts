import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { VehicleCostCreation } from '../../data/model/vehicleCostCreation';
import { VehicleCost } from '../../api/vehicleCost';

@Injectable({
    providedIn: 'root'
})
export class VehicleCostService {

    constructor(private http: HttpClient) { }

    getVehicleCosts(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.construction.vehicleCost.vehicleCostsUrL + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createVehicleCost(vehicleCost: VehicleCostCreation) : Observable<VehicleCost> {
        return this.http.post<VehicleCost>(environment.construction.vehicleCost.vehicleCostsUrL, vehicleCost, environment.httpOptions);
    }

    deleteVehicleCost(vehicleCostId: number) {
        let url = environment.construction.vehicleCost.deleteVehicleCostUrL + vehicleCostId;
        return this.http.delete(url);
    }
    
}