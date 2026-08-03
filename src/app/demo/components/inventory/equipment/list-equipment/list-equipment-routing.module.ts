import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListEquipmentComponent } from './list-equipment.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListEquipmentComponent },
		{ path: 'create-equipment', data: { breadcrumb: 'Novo Equipamento' }, loadChildren: () => import('../create-equipment/create-equipment.module').then(m => m.CreateEquipmentModule) },
	])],
	exports: [RouterModule]
})

export class ListEquipmentRoutingModule { }
