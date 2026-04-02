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

    constructor(private http: HttpClient) { }

    getExternalEntities(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.company.externalEntity.externalEntitiesUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createExternalEntity(externalEntity: ExternalEntityCreation) : Observable<ExternalEntity> {
        return this.http.post<ExternalEntity>(environment.company.externalEntity.externalEntitiesUrl, externalEntity, environment.httpOptions);
    }

    deleteExternalEntity(externalEntityId: number) {
        let url = environment.company.externalEntity.externalEntitiesUrl + externalEntityId;
        return this.http.delete(url);
    }
}