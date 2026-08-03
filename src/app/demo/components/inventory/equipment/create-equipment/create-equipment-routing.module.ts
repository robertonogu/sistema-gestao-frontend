import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateEquipmentComponent } from './create-equipment.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateEquipmentComponent }
	])],
	exports: [RouterModule]
})

export class CreateEquipmentRoutingModule { }
