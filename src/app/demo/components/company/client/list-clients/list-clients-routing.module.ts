import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListClientsComponent } from './list-clients.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListClientsComponent },
		{ path: 'create-client', data: { breadcrumb: 'Criar Cliente'}, loadChildren: () => import('../create-client/create-client.module').then(m => m.CreateClientModule) },
	])],
	exports: [RouterModule]
})

export class ListClientsRoutingModule { }
