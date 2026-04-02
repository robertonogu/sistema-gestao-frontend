import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'sales', data: { breadcrumb: 'Vendas' }, loadChildren: () => import('./sale/list-sales/list-sales.module').then(m => m.ListSalesModule) },
        { path: 'revenues', data: { breadcrumb: 'Receitas' }, loadChildren: () => import('./revenue/list-revenues/list-revenues.module').then(m => m.ListRevenuesModule) },
        { path: 'expenses', data: { breadcrumb: 'Despesas' }, loadChildren: () => import('./expense/list-expenses/list-expenses.module').then(m => m.ListExpensesModule) },
        { path: 'payments', data: { breadcrumb: 'Pagamentos' }, loadChildren: () => import('./payment/list-payments/list-payments.module').then(m => m.ListPaymentsModule) },
        { path: 'movements',  data: { breadcrumb: 'Movimentos' }, loadChildren: () => import('./movement/list-movements/list-movements.module').then(m => m.ListMovementsModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class TransactionsRoutingModule { }
