import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateAbsenceComponent } from './create-absence.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateAbsenceComponent }
	])],
	exports: [RouterModule]
})

export class CreateAbsenceRoutingModule { }
