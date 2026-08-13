import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListAccountsComponent } from './list-accounts.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListAccountsComponent },
	])],
	exports: [RouterModule]
})

export class ListAccountsRoutingModule { }
