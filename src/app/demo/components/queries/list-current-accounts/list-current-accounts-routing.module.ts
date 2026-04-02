import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCurrentAccountsComponent } from './list-current-accounts.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListCurrentAccountsComponent }
	])],
	exports: [RouterModule]
})

export class ListCurrentAccountsRoutingModule { }
