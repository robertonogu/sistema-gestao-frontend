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

    private bankAccountNamesUrl = `${environment.apiUrl}/bankAccountNames`;
    private accountNamesUrl = `${environment.apiUrl}/accountNames`;
    private accountsUrl = `${environment.apiUrl}/accounts`;
    private deleteAccountUrl = `${environment.apiUrl}/accounts/`;

    constructor(private http: HttpClient) { }

    getBankAccountNames() : Observable<ObjectName[]> {
        return this.http.get<ObjectName[]>(this.bankAccountNamesUrl);
    }

    getAccountNames() : Observable<ObjectName[]> {
        return this.http.get<ObjectName[]>(this.accountNamesUrl);
    }

    getAccounts(currentPage: number, pageSize: number) : Observable<ObjectList> {
        let url = this.accountsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createAccount(account: AccountCreation) : Observable<Account> {
        return this.http.post<Account>(this.accountsUrl, account, environment.httpOptions);
    }

    updateAccount(accountId: number, account: AccountCreation) : Observable<Account> {
        let url = this.accountsUrl + "/" + accountId;
        return this.http.put<Account>(url, account, environment.httpOptions);
    }

    deleteAccount(accountId: number) {
        let url = this.deleteAccountUrl + accountId;
        return this.http.delete(url);
    }
}