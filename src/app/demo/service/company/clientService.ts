import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { ItemName } from '../../api/itemName';
import { ClientCreation } from '../../data/model/clientCreation.model';
import { Client } from '../../api/client';

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    constructor(private http: HttpClient) { }

    getClients(currentPage: number, pageSize: number, sortBy: string, sortOrder: string) : Observable<ObjectList> {
        let url = environment.company.client.clientsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize + "&sortBy=" + sortBy + "&sortDirection=" + sortOrder;
        return this.http.get<ObjectList>(url);
    }

    getClientNames() : Observable<ItemName[]> {
        let url = environment.company.client.clientNamesUrl;
        return this.http.get<ItemName[]>(url);
    }

    createClient(client: ClientCreation) : Observable<Client> {
        return this.http.post<Client>(environment.company.client.createClientUrl, client, environment.httpOptions);
    }

    deleteClient(clientId: number) {
        let url = environment.company.client.deleteClient + clientId;
        return this.http.delete(url);
    }
}