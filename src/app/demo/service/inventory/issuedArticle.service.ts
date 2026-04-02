import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { ListIssuedArticlesCreation } from '../../data/model/listIssuedArticlesCreation.model';

@Injectable({
    providedIn: 'root'
})
export class IssuedArticleService {

    constructor(private http: HttpClient) { }

    issueArticles(list: ListIssuedArticlesCreation) : Observable<any> {
        return this.http.post<any>(environment.inventory.article.issuedArticlesUrl, list);
    }

    getIssuedArticles(currentPage: number, pageSize: number) : Observable<ObjectList> {
        return this.http.get<ObjectList>(environment.inventory.article.issuedArticlesUrl);
    }
    
}