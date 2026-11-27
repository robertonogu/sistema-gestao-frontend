import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface EquipmentExpense {
    expenseItemId: number;
    date: string | Date;
    documentNumber: string;
    origin: string | null;
    subCategoryType: string;
    name: string;
    quantity: number;
    totalValue: number;
}

@Injectable({
    providedIn: 'root'
})
export class EquipmentExpenseService {

    constructor(private http: HttpClient) { }

    getEquipmentExpenses(equipmentId: number): Observable<EquipmentExpense[]> {
        return this.http.get<EquipmentExpense[]>(`${environment.apiUrl}/equipmentExpenses?equipmentId=${equipmentId}`);
    }
}
