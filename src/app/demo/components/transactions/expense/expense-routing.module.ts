import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListExpensesComponent } from './list-expenses/list-expenses.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListExpensesComponent }
	])],
	exports: [RouterModule]
})
export class ExpenseRoutingModule { }
