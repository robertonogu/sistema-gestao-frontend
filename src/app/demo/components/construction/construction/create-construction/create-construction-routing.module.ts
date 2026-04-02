import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateConstructionComponent } from './create-construction.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateConstructionComponent }
	])],
	exports: [RouterModule]
})

export class CreateConstructionRoutingModule { }
