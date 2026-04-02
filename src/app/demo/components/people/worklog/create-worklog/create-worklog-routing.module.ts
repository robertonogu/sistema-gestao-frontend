import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { CreateWorklogComponent } from './create-worklog.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateWorklogComponent }
	])],
	exports: [RouterModule]
})
export class CreateWorklogRoutingModule { }
