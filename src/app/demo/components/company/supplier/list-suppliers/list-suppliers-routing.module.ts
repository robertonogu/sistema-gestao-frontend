import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListSuppliersComponent } from './list-suppliers.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListSuppliersComponent },
	])],
	exports: [RouterModule]
})

export class ListSuppliersRoutingModule { }
