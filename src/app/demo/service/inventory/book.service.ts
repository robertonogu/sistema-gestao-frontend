import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book } from '../../api/book';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    private booksUrl = `${environment.apiUrl}/books`;

    constructor(private http: HttpClient) { }

    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(this.booksUrl);
    }
}
