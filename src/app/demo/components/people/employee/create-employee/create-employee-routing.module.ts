import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateEmployeeComponent } from './create-employee.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateEmployeeComponent }
	])],
	exports: [RouterModule]
})
export class CreateEmployeeRoutingModule { }
