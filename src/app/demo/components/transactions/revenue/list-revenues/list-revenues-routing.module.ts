import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListRevenuesComponent } from './list-revenues.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListRevenuesComponent },
		{ path: 'create-revenue', data: { breadcrumb: 'Nova Receita' }, loadChildren: () => import('../create-revenue/create-revenue.module').then(m => m.CreateRevenueModule) },
		{ path: 'edit-revenue/:revenueId', data: { breadcrumb: 'Editar Receita' }, loadChildren: () => import('../edit-revenue/edit-revenue.module').then(m => m.EditRevenueModule) }
	])],
	exports: [RouterModule]
})

export class ListRevenuesRoutingModule { }
