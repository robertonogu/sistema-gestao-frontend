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

    constructor(private http: HttpClient) { }

    getMovements(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.transactions.movement.movementsUrl + "?pageNo=" +  currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createMovement(newMovement: MovementCreation) : Observable<Movement> {
        return this.http.post<Movement>(environment.transactions.movement.movementsUrl, newMovement, environment.httpOptions);
    }
}