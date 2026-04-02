import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListWorkLogsComponent } from './list-worklogs/list-worklogs.component';
import { CreateWorklogComponent } from './create-worklog/create-worklog.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListWorkLogsComponent },
		{ path: 'create-worklog', component: CreateWorklogComponent }
	])],
	exports: [RouterModule]
})
export class WorkLogRoutingModule { }
