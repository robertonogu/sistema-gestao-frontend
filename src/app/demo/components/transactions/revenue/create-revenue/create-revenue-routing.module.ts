import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateRevenueComponent } from './create-revenue.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateRevenueComponent }
	])],
	exports: [RouterModule]
})

export class CreateRevenueRoutingModule { }
