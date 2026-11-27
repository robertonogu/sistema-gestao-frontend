import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListEquipmentComponent } from './list-equipment.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListEquipmentComponent },
		{ path: 'dashboard/:equipmentId', data: { breadcrumb: 'Equipamento' }, loadChildren: () => import('../equipment-dashboard/equipment-dashboard.module').then(m => m.EquipmentDashboardModule) },
		{ path: 'create-equipment', data: { breadcrumb: 'Novo Equipamento' }, loadChildren: () => import('../create-equipment/create-equipment.module').then(m => m.CreateEquipmentModule) },
		{ path: 'view-equipment/:equipmentId', data: { breadcrumb: 'Ver Equipamento', mode: 'view' }, loadChildren: () => import('../create-equipment/create-equipment.module').then(m => m.CreateEquipmentModule) },
		{ path: 'edit-equipment/:equipmentId', data: { breadcrumb: 'Editar Equipamento' }, loadChildren: () => import('../create-equipment/create-equipment.module').then(m => m.CreateEquipmentModule) },
	])],
	exports: [RouterModule]
})

export class ListEquipmentRoutingModule { }
