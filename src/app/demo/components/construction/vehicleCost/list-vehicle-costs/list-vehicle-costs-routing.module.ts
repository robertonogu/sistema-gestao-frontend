import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListVehicleCostsComponent } from './list-vehicle-costs.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListVehicleCostsComponent },
		{ path: 'create-vehicleCost', data: { breadcrumb: 'Nova Deslocação'}, loadChildren: () => import('../create-vehicle-cost/create-vehicle-cost.module').then(m => m.CreateVehicleCostModule) },
	])],
	exports: [RouterModule]
})

export class ListVehicleCostsRoutingModule { }
