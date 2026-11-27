import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface VehicleExpense {
    expenseItemId: number;
    date: string | Date;
    documentNumber: string;
    origin: string | null;
    vehicleId: number | null;
    registration: string | null;
    subCategoryType: string;
    name: string;
    quantity: number;
    totalValue: number;
}

@Injectable({
    providedIn: 'root'
})
export class VehicleExpenseService {

    constructor(private http: HttpClient) { }

    getVehicleExpenses(vehicleId?: number): Observable<VehicleExpense[]> {
        const query = vehicleId != null ? `?vehicleId=${vehicleId}` : '';
        return this.http.get<VehicleExpense[]>(`${environment.apiUrl}/vehicleExpenses${query}`);
    }
}
