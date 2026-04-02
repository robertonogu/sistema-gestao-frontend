import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ObjectList } from '../../api/objectList';
import { environment } from 'src/environments/environment';
import { Sale } from '../../api/sale';
import { SaleCreation } from '../../api/saleCreation';

@Injectable({
    providedIn: 'root'
})
export class SaleService {

    constructor(private http: HttpClient) { }

    getSales(currentPage: number, pageSize: number) : Observable<ObjectList> {
      let url = environment.transactions.sale.salesUrl + "?pageNo=" +  currentPage + "&pageSize=" + pageSize;
      return this.http.get<ObjectList>(url);
    }

    createSale(newSale: SaleCreation) : Observable<Sale> {
      return this.http.post<Sale>(environment.transactions.sale.salesUrl, newSale, environment.httpOptions).pipe(
        catchError(this.handleError)
      );;
    }

    deleteSale(saleId: number) {
      let url = environment.transactions.sale.deleteSale + saleId;
      return this.http.delete(url);
    }

    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'An unknown error occurred!';
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        console.log(error.error.message)
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Backend error
        console.log(error.message)
        if (error.status === 409) {
          errorMessage = 'Document number already exists';
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }
      return throwError(errorMessage);
    }
}