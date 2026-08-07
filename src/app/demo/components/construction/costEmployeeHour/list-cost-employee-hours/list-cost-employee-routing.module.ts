import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCostEmployeeHoursComponent } from './list-cost-employee-hours.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListCostEmployeeHoursComponent },
	])],
	exports: [RouterModule]
})

export class ListCostEmployeeHoursRoutingModule { }
