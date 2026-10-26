import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListFinancersComponent } from './list-financers.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListFinancersComponent },
	])],
	exports: [RouterModule]
})
export class ListFinancersRoutingModule { }
