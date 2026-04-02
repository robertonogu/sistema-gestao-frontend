import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListExpensesComponent } from './list-expenses.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListExpensesComponent },
		{ path: 'create-expense', data: { breadcrumb: 'Nova Despesa' }, loadChildren: () => import('../create-expense/create-expense.module').then(m => m.CreateExpenseModule) },
	])],
	exports: [RouterModule]
})

export class ListExpensesRoutingModule { }
