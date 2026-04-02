import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListPaymentsComponent } from './list-payments/list-payments.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListPaymentsComponent }
	])],
	exports: [RouterModule]
})
export class PaymentRoutingModule { }
