import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateToolComponent } from './create-tool.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateToolComponent }
	])],
	exports: [RouterModule]
})

export class CreateToolRoutingModule { }
