import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectList } from '../../api/objectList';
import { ItemName } from '../../api/itemName';
import { SupplierCreation } from '../../data/model/supplierCreation.model';
import { Supplier } from '../../api/supplier';

@Injectable({
    providedIn: 'root'
})
export class SupplierService {

    constructor(private http: HttpClient) { }

    getSuppliers(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.company.supplier.suppliersUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    getSupplierNames() : Observable<ItemName[]> {
        let url = environment.company.supplier.supplierNamesUrl;
        return this.http.get<ItemName[]>(url);
    }

    createSupplier(supplier: SupplierCreation) : Observable<Supplier> {
        return this.http.post<Supplier>(environment.company.supplier.suppliersUrl, supplier, environment.httpOptions);
    }

}