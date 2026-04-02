import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListSalesComponent } from './list-sales.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListSalesComponent },
		{ path: 'create-sale', data: { breadcrumb: 'Nova Venda' }, loadChildren: () => import('../create-sale/create-sale.module').then(m => m.CreateSaleModule) },
	])],
	exports: [RouterModule]
})

export class ListSalesRoutingModule { }
