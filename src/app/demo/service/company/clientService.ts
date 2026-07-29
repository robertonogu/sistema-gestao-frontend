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

    private clientsUrl = `${environment.apiUrl}/clients`;
    private clientNamesUrl = `${environment.apiUrl}/clientNames`;
    private createClientUrl = `${environment.apiUrl}/clients`;
    private deleteClientUrl = `${environment.apiUrl}/clients/`;

    constructor(private http: HttpClient) { }

    getClients(currentPage: number, pageSize: number, sortBy: string, sortOrder: string) : Observable<ObjectList> {
                console.log(this.clientsUrl)
        let url = this.clientsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize + "&sortBy=" + sortBy + "&sortDirection=" + sortOrder;
        return this.http.get<ObjectList>(url);
    }

    getClientNames() : Observable<ItemName[]> {
        let url = this.clientNamesUrl;
        return this.http.get<ItemName[]>(url);
    }

    createClient(client: ClientCreation) : Observable<Client> {
        return this.http.post<Client>(this.createClientUrl, client, environment.httpOptions);
    }

    deleteClient(clientId: number) {
        let url = this.deleteClientUrl + clientId;
        return this.http.delete(url);
    }
}