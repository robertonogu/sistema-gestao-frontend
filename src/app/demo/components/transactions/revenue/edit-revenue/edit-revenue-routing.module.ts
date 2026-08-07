import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditRevenueComponent } from './edit-revenue.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EditRevenueComponent }
	])],
	exports: [RouterModule]
})

export class EditRevenueRoutingModule { }
