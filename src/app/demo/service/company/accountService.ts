import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObjectName } from '../../api/objectName';
import { AccountName } from '../../api/accountName';
import { ObjectList } from '../../api/objectList';
import { environment } from 'src/environments/environment';
import { AccountCreation } from '../../data/model/accountCreation.model';
import { Account } from '../../api/account';
import { PaymentMethod } from '../../data/enum/paymentMethod';

export const PAYMENT_METHODS_BY_ACCOUNT_TYPE: Record<'bank' | 'cash', PaymentMethod[]> = {
  cash: [
    PaymentMethod.CASH,
  ],
  bank: [
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.DIRECT_DEBIT,
    PaymentMethod.CREDIT_CARD,
    PaymentMethod.DEBIT_CARD,
    PaymentMethod.CHECK,
    PaymentMethod.PAYMENT_REFERENCE,
    PaymentMethod.MB_WAY,
    PaymentMethod.ANOTHER,
  ],
};

export const CASH_PAYMENT_METHOD_KEY = 'CASH' as unknown as PaymentMethod;

export function getPaymentMethodEntries(cashBox: boolean | null | undefined): { key: string; value: string }[] {
  const allowed = cashBox == null
    ? Object.values(PaymentMethod)
    : PAYMENT_METHODS_BY_ACCOUNT_TYPE[cashBox ? 'cash' : 'bank'];

  return Object.entries(PaymentMethod)
    .filter(([, value]) => allowed.includes(value as PaymentMethod))
    .map(([key, value]) => ({ key, value }));
}

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

    getAccountNamesWithType(): Observable<AccountName[]> {
        return forkJoin({
            all: this.getAccountNames(),
            bank: this.getBankAccountNames()
        }).pipe(map(({ all, bank }) => {
            const bankAccountIds = new Set(bank.map(account => account.objectId));
            return all.map(account => ({ ...account, cashBox: !bankAccountIds.has(account.objectId) }));
        }));
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