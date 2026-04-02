import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailsConstructionComponent } from './details-construction.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DetailsConstructionComponent }
	])],
	exports: [RouterModule]
})

export class DetailsConstructionRoutingModule { }
