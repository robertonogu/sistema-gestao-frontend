import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';;
import { ListEquipmentsComponent } from './list-equipments.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListEquipmentsComponent }
	])],
	exports: [RouterModule]
})

export class ListEquipmentsRoutingModule { }
