import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObjectName } from '../../api/objectName';
import { ObjectList } from '../../api/objectList';
import { environment } from 'src/environments/environment';
import { AccountCreation } from '../../data/model/accountCreation.model';
import { Account } from '../../api/account';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(private http: HttpClient) { }

    getBankAccountNames() : Observable<ObjectName[]> {
        return this.http.get<ObjectName[]>(environment.queries.accountLogs.bankAccountNamesUrl);
    }

    getAccountNames() : Observable<ObjectName[]> {
        return this.http.get<ObjectName[]>(environment.company.account.accountNamesUrl);
    }
    
    getAccounts(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = environment.company.account.accountsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createAccount(account: AccountCreation) : Observable<Account> {
        return this.http.post<Account>(environment.company.account.accountsUrl, account, environment.httpOptions);
    }
}