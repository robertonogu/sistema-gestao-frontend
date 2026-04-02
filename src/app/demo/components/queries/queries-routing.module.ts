import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'debts', data: { breadcrumb: 'Débitos' }, loadChildren: () => import('./list-debts/list-debts.module').then(m => m.ListDebtsModule) },
        { path: 'accountLogs',  data: { breadcrumb: 'Mapa Banco' }, loadChildren: () => import('./list-account-logs/list-account.logs.module').then(m => m.ListAccountLogsModule) },
        { path: 'cashAccountLogs',  data: { breadcrumb: 'Mapa Caixa' }, loadChildren: () => import('./list-cash-logs/list-cash-logs.module').then(m => m.ListCashLogsModule) },
        { path: 'currentAccounts',  data: { breadcrumb: 'Contas Corrente' }, loadChildren: () => import('./list-current-accounts/list-current-accounts.module').then(m => m.ListCurrentAccountsModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class QueriesRoutingModule { }
