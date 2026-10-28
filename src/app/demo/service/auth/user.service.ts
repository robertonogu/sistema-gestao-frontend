import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, UserCreation } from '../../api/auth';

// Utilizadores (página Pessoal > Utilizadores, só administradores)
@Injectable({
    providedIn: 'root'
})
export class UserService {

    private usersUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.usersUrl);
    }

    createUser(user: UserCreation): Observable<User> {
        return this.http.post<User>(this.usersUrl, user, environment.httpOptions);
    }

    changePassword(userId: number, password: string): Observable<User> {
        return this.http.put<User>(`${this.usersUrl}/${userId}/password`, { password }, environment.httpOptions);
    }

    setActive(userId: number, active: boolean): Observable<User> {
        return this.http.put<User>(`${this.usersUrl}/${userId}/active?active=${active}`, {}, environment.httpOptions);
    }
}
