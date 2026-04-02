import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListAbsencesComponent } from './list-absences.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListAbsencesComponent }
	])],
	exports: [RouterModule]
})

export class ListAbsencesRoutingModule { }
