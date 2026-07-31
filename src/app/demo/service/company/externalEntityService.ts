import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { ExternalEntity } from '../../api/externalEntity';
import { ExternalEntityCreation } from '../../data/model/externalEntityCreation.model';

@Injectable({
    providedIn: 'root'
})
export class ExternalEntityService {

    private externalEntitiesUrl = `${environment.apiUrl}/externalEntities`;

    constructor(private http: HttpClient) { }

    getExternalEntities(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.externalEntitiesUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createExternalEntity(externalEntity: ExternalEntityCreation) : Observable<ExternalEntity> {
        return this.http.post<ExternalEntity>(this.externalEntitiesUrl, externalEntity, environment.httpOptions);
    }

    updateExternalEntity(externalEntityId: number, externalEntity: ExternalEntityCreation) : Observable<ExternalEntity> {
        let url = this.externalEntitiesUrl + "/" + externalEntityId;
        return this.http.put<ExternalEntity>(url, externalEntity, environment.httpOptions);
    }

    deleteExternalEntity(externalEntityId: number) {
        let url = this.externalEntitiesUrl + externalEntityId;
        return this.http.delete(url);
    }
}