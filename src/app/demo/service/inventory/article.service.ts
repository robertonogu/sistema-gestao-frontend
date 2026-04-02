import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    constructor(private http: HttpClient) { }

    getArticles(currentPage: number, pageSize: number) : Observable<ObjectList> {
        return this.http.get<ObjectList>(environment.inventory.article.articlesUrl);
    }

    findStockToday() : Observable<ObjectList> {
        return this.http.get<ObjectList>(environment.inventory.article.stockArticles);
    }

    findStockAsOfDate(date: string) : Observable<ObjectList> {
        let url = environment.inventory.article.stockArticles + "/date?date=" + date;
        console.log(url);
        return this.http.get<ObjectList>(url);
    }
    
}