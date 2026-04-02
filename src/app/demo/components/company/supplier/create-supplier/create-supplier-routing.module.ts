import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateSupplierComponent } from './create-supplier.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateSupplierComponent }
	])],
	exports: [RouterModule]
})
export class CreateSupplierRoutingModule { }
