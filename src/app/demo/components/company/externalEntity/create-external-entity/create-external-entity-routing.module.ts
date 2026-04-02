import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateExternalEntityComponent } from './create-external-entity.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateExternalEntityComponent }
	])],
	exports: [RouterModule]
})
export class CreateExternalEntityRoutingModule { }
