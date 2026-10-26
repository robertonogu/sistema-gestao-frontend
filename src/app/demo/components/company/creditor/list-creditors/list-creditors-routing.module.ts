import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCreditorsComponent } from './list-creditors.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListCreditorsComponent },
	])],
	exports: [RouterModule]
})
export class ListCreditorsRoutingModule { }
