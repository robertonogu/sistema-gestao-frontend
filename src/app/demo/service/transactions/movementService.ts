import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObjectList } from '../../api/objectList';
import { environment } from 'src/environments/environment';
import { MovementCreation } from '../../data/model/movement.model';
import { Movement } from '../../api/movement';

@Injectable({
    providedIn: 'root'
})
export class MovementService {

    private movementsUrl = `${environment.apiUrl}/movements`;
    private movementByIdUrl = `${environment.apiUrl}/movements/`;

    constructor(private http: HttpClient) { }

    getMovements(currentPage: number, pageSize: number, dateFrom?: Date, dateTo?: Date) : Observable<ObjectList> {
        let url = this.movementsUrl + "?pageNo=" +  currentPage + "&pageSize=" + pageSize;
        if (dateFrom) url += "&dateFrom=" + this.formatDate(dateFrom);
        if (dateTo) url += "&dateTo=" + this.formatDate(dateTo);
        return this.http.get<ObjectList>(url);
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    createMovement(newMovement: MovementCreation) : Observable<Movement> {
        return this.http.post<Movement>(this.movementsUrl, newMovement, environment.httpOptions);
    }

    updateMovement(movementId: number, movement: MovementCreation) : Observable<Movement> {
        let url = this.movementByIdUrl + movementId;
        return this.http.put<Movement>(url, movement, environment.httpOptions);
    }
}