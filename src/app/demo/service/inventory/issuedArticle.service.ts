import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListIssuedArticlesCreation } from '../../data/model/listIssuedArticlesCreation.model';

@Injectable({
    providedIn: 'root'
})
export class IssuedArticleService {

    private issuedArticlesUrl = `${environment.apiUrl}/issuedArticles`;

    constructor(private http: HttpClient) { }

    issueArticles(list: ListIssuedArticlesCreation) : Observable<any> {
        return this.http.post<any>(this.issuedArticlesUrl, list);
    }

}