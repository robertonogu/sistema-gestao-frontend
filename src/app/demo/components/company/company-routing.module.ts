import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'clients', data: { breadcrumb: 'Clientes'}, loadChildren: () => import('./client/list-clients/list-clients.module').then(m => m.ListClientsModule) },
        { path: 'suppliers', data: { breadcrumb: 'Fornecedores'}, loadChildren: () => import('./supplier/list-suppliers/list-suppliers.module').then(m => m.ListSuppliersModule) },
        { path: 'externalEntities', data: { breadcrumb: 'Entidades Externas'}, loadChildren: () => import('./externalEntity/list-external-entities/list-external-entities.module').then(m => m.ListExternalEntitiesModule) },
        { path: 'accounts', data: { breadcrumb: 'Contas'}, loadChildren: () => import('./account/list-accounts/list-accounts.module').then(m => m.ListAccountsModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }
