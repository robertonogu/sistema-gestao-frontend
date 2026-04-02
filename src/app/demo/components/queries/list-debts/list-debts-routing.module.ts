import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListDebtsComponent } from './list-debts.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListDebtsComponent }
	])],
	exports: [RouterModule]
})

export class ListDebtsRoutingModule { }
