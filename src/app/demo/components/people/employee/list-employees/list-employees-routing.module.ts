import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListEmployeesComponent } from './list-employees.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListEmployeesComponent }
	])],
	exports: [RouterModule]
})

export class ListEmployeesRoutingModule { }
