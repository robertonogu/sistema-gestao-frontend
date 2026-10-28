import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';

// Junta o token da sessão a todos os pedidos à API. Se a API responder 401 (sessão expirada ou utilizador
// desativado), termina a sessão e volta ao login. O AuthService é obtido só no pedido: injetá-lo no construtor
// criaria um ciclo (o AuthService usa o HttpClient, que usa este interceptor).
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.apiUrl)) return next.handle(request);

    const authService = this.injector.get(AuthService);
    const token = authService.token;
    const authorized = token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
    return next.handle(authorized).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token) authService.expire();
        return throwError(() => error);
      })
    );
  }
}
