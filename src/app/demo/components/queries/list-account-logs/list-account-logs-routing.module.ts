import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListAccountLogsComponent } from './list-account-logs.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListAccountLogsComponent }
	])],
	exports: [RouterModule]
})

export class ListAccountLogsRoutingModule { }
