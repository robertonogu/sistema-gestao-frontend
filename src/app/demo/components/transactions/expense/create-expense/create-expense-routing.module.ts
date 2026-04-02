import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateExpenseComponent } from './create-expense.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateExpenseComponent }
	])],
	exports: [RouterModule]
})
export class CreateExpenseRoutingModule { }
