import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCashLogsComponent } from './list-cash-logs.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListCashLogsComponent }
	])],
	exports: [RouterModule]
})

export class ListCashAccountLogsRoutingModule { }
