import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditConstructionComponent } from './edit-construction.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EditConstructionComponent }
	])],
	exports: [RouterModule]
})

export class EditConstructionRoutingModule { }
