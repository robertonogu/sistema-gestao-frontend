import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateSaleComponent } from './create-sale.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateSaleComponent }
	])],
	exports: [RouterModule]
})

export class CreateSaleRoutingModule { }
