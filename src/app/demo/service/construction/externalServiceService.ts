import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstructionNames } from '../../api/constructionNames';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';

@Injectable({
    providedIn: 'root'
})
export class ExternalServiceService {

    constructor(private http: HttpClient) { }

    getExternalServices(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.construction.externalService.externalServicesUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }
    
}