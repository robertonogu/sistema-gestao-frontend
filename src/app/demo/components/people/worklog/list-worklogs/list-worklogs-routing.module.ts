import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListWorkLogsComponent } from './list-worklogs.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListWorkLogsComponent }
	])],
	exports: [RouterModule]
})

export class ListWorkLogsRoutingModule { }
