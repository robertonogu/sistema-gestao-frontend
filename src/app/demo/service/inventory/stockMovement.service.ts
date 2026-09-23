import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';

export interface StockMovementFilters {
    documentNumber?: string;
    originId?: number;
    itemName?: string;
}

@Injectable({
    providedIn: 'root'
})
export class StockMovementService {

    private stockMovementsUrl = `${environment.apiUrl}/stockMovements`;

    constructor(private http: HttpClient) { }

    private filtersQuery(filters?: StockMovementFilters): string {
        let query = "";
        if (filters?.documentNumber) query += "&documentNumber=" + encodeURIComponent(filters.documentNumber);
        if (filters?.originId != null) query += "&originId=" + filters.originId;
        if (filters?.itemName) query += "&itemName=" + encodeURIComponent(filters.itemName);
        return query;
    }

    getStockEntries(currentPage: number, pageSize: number, filters?: StockMovementFilters) : Observable<ObjectList> {
        let url = this.stockMovementsUrl + "/in?pageNo=" + currentPage + "&pageSize=" + pageSize + this.filtersQuery(filters);
        return this.http.get<ObjectList>(url);
    }

    getStockExits(currentPage: number, pageSize: number, filters?: StockMovementFilters) : Observable<ObjectList> {
        let url = this.stockMovementsUrl + "/out?pageNo=" + currentPage + "&pageSize=" + pageSize + this.filtersQuery(filters);
        return this.http.get<ObjectList>(url);
    }

    getStockAsOfDate(date: string, currentPage: number, pageSize: number, filters?: StockMovementFilters) : Observable<ObjectList> {
        let url = this.stockMovementsUrl + "/stock/date?date=" + date + "&pageNo=" + currentPage + "&pageSize=" + pageSize + this.filtersQuery(filters);
        return this.http.get<ObjectList>(url);
    }

}
