import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListSuppliersComponent } from './list-suppliers.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListSuppliersComponent },
		{ path: 'create-supplier', data: { breadcrumb: 'Criar Fornecedor'}, loadChildren: () => import('../create-supplier/create-supplier.module').then(m => m.CreateSupplierModule) },
	])],
	exports: [RouterModule]
})

export class ListSuppliersRoutingModule { }
