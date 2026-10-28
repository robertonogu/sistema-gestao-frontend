import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentAccountLog } from '../../api/currentAccountLog';
import { environment } from 'src/environments/environment';
import { OriginType } from '../../api/originType';

// Página da conta corrente com os totais de todos os registos filtrados
export interface CurrentAccountLogPage {
    objectList: CurrentAccountLog[];
    totalElements: number;
    totalCredit: number;
    totalDebt: number;
    balance: number;
}

// Uma origem na página Saldos: o saldo da conta corrente (crédito - débito)
export interface OriginBalance {
    originId: number;
    name: string;
    type: OriginType | null;
    balance: number;
}

export interface CurrentAccountLogFilters {
    dateFrom?: Date;
    dateTo?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class CurrentAccountLogService {

    private currentAccountLogsUrl = `${environment.apiUrl}/currentAccountLogs/`;

    constructor(private http: HttpClient) { }

    // Saldo da conta corrente de todas as origens (funcionários, credores, financiadores, fornecedores…)
    getBalances() : Observable<OriginBalance[]> {
        return this.http.get<OriginBalance[]>(`${environment.apiUrl}/currentAccountBalances`);
    }

    getCurrentAccountLogs(currentPage: number, pageSize: number, originId: number, filters?: CurrentAccountLogFilters) : Observable<CurrentAccountLogPage> {
        let url = this.currentAccountLogsUrl + originId + "?pageNo=" + currentPage + "&pageSize=" + pageSize + this.filterParams(filters);
        return this.http.get<CurrentAccountLogPage>(url);
    }

    // Todos os registos filtrados (do mais antigo para o mais recente), para exportar
    exportCurrentAccountLogs(originId: number, filters?: CurrentAccountLogFilters) : Observable<{ objectList: CurrentAccountLog[] }> {
        const url = `${environment.apiUrl}/currentAccountLogsExport/` + originId + "?" + this.filterParams(filters).substring(1);
        return this.http.get<{ objectList: CurrentAccountLog[] }>(url);
    }

    private filterParams(filters?: CurrentAccountLogFilters): string {
        let params = "";
        if (filters?.dateFrom) params += "&dateFrom=" + this.formatDate(filters.dateFrom);
        if (filters?.dateTo) params += "&dateTo=" + this.formatDate(filters.dateTo);
        return params;
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

}
