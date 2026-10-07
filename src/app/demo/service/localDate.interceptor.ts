import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// A API trata as datas como dias de calendário (LocalDate, "yyyy-MM-dd"). Sem isto, um Date seria enviado como
// instante UTC (p.ex. o dia 12 às 00:00 em Lisboa vai como "…-11T23:00:00Z") e chegava à API como o dia anterior.
@Injectable()
export class LocalDateInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.body == null || request.body instanceof FormData || request.body instanceof Blob) {
      return next.handle(request);
    }
    return next.handle(request.clone({ body: toLocalDates(request.body) }));
  }
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toLocalDates(value: any): any {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : formatLocalDate(value);
  if (Array.isArray(value)) return value.map(toLocalDates);
  if (value !== null && typeof value === 'object') {
    const result: any = {};
    for (const key of Object.keys(value)) result[key] = toLocalDates(value[key]);
    return result;
  }
  return value;
}

// Lê uma data "yyyy-MM-dd" da API como dia local (new Date("yyyy-MM-dd") seria meia-noite UTC)
export function parseLocalDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.substring(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}
