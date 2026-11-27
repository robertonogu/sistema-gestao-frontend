import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListVehiclesComponent } from './list-vehicles.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListVehiclesComponent },
		{ path: 'dashboard/:vehicleId', data: { breadcrumb: 'Viatura' }, loadChildren: () => import('../vehicle-dashboard/vehicle-dashboard.module').then(m => m.VehicleDashboardModule) },
		{ path: 'create-vehicle', data: { breadcrumb: 'Nova Viatura' }, loadChildren: () => import('../create-vehicle/create-vehicle.module').then(m => m.CreateVehicleModule) },
		{ path: 'edit-vehicle/:vehicleId', data: { breadcrumb: 'Editar Viatura' }, loadChildren: () => import('../create-vehicle/create-vehicle.module').then(m => m.CreateVehicleModule) },
	])],
	exports: [RouterModule]
})

export class ListVehiclesRoutingModule { }
