import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    private stockArticlesUrl = `${environment.apiUrl}/articles/stock`;

    constructor(private http: HttpClient) { }

    findStockToday() : Observable<ObjectList> {
        return this.http.get<ObjectList>(this.stockArticlesUrl);
    }

}