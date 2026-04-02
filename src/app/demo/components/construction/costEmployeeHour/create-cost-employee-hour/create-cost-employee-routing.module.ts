import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateCostEmployeeHourComponent } from './create-cost-employee-hour.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateCostEmployeeHourComponent }
	])],
	exports: [RouterModule]
})

export class CreateCostEmployeeHourRoutingModule { }
