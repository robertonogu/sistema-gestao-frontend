import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListVehiclesComponent } from './list-vehicles.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListVehiclesComponent },
		{ path: 'create-vehicle', data: { breadcrumb: 'Nova Viatura' }, loadChildren: () => import('../create-vehicle/create-vehicle.module').then(m => m.CreateVehicleModule) },
	])],
	exports: [RouterModule]
})

export class ListVehiclesRoutingModule { }
