import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    private articlesUrl = `${environment.apiUrl}/articles`;
    private stockArticlesUrl = `${environment.apiUrl}/articles/stock`;

    constructor(private http: HttpClient) { }

    getArticles(currentPage: number, pageSize: number) : Observable<ObjectList> {
        return this.http.get<ObjectList>(this.articlesUrl);
    }

    findStockToday() : Observable<ObjectList> {
        return this.http.get<ObjectList>(this.stockArticlesUrl);
    }

    findStockAsOfDate(date: string) : Observable<ObjectList> {
        let url = this.stockArticlesUrl + "/date?date=" + date;
        console.log(url);
        return this.http.get<ObjectList>(url);
    }

}