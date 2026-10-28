import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Session } from '../../api/auth';

const STORAGE_KEY = 'alvedaSession';

// Sessão do utilizador (token JWT da API) guardada no browser. O administrador vai para o backoffice;
// o funcionário para a app do funcionário (#/app).
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private sessionSubject = new BehaviorSubject<Session | null>(readSession());
    session$ = this.sessionSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    // null se não houver sessão ou se já tiver expirado
    get session(): Session | null {
        const session = this.sessionSubject.value;
        if (session && new Date(session.expiresAt).getTime() <= Date.now()) {
            this.clear();
            return null;
        }
        return session;
    }

    get token(): string | null {
        return this.session?.token ?? null;
    }

    login(username: string, password: string): Observable<Session> {
        return this.http.post<Session>(`${environment.apiUrl}/auth/login`, { username, password }, environment.httpOptions)
            .pipe(tap(session => this.store(session)));
    }

    logout(): void {
        this.clear();
        this.router.navigate(['/auth/login']);
    }

    // A API recusou o token (expirado, utilizador desativado…): volta ao login e depois à mesma página
    expire(): void {
        if (!this.sessionSubject.value) return;
        this.clear();
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url, expired: 1 } });
    }

    homeRoute(): string {
        return this.session?.role === 'EMPLOYEE' ? '/app' : '/';
    }

    private store(session: Session): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        } catch { }
        this.sessionSubject.next(session);
    }

    private clear(): void {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch { }
        this.sessionSubject.next(null);
    }
}

function readSession(): Session | null {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    } catch {
        return null;
    }
}
