import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListAccountsComponent } from './list-accounts.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListAccountsComponent },
		{ path: 'create-account', data: { breadcrumb: 'Criar Conta'}, loadChildren: () => import('../create-account/create-account.module').then(m => m.CreateAccountModule) },
	])],
	exports: [RouterModule]
})

export class ListAccountsRoutingModule { }
