import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateVehicleCostComponent } from './create-vehicle-cost.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateVehicleCostComponent }
	])],
	exports: [RouterModule]
})

export class CreateVehicleCostRoutingModule { }
