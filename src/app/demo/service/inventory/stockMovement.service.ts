import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';

@Injectable({
    providedIn: 'root'
})
export class StockMovementService {

    private stockMovementsUrl = `${environment.apiUrl}/stockMovements`;

    constructor(private http: HttpClient) { }

    getStockEntries(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.stockMovementsUrl + "/in?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    getStockExits(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.stockMovementsUrl + "/out?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    getStockAsOfDate(date: string, currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.stockMovementsUrl + "/stock/date?date=" + date + "&pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

}
