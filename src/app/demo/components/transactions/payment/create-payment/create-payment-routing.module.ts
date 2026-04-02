import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreatePaymentComponent } from './create-payment.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreatePaymentComponent }
	])],
	exports: [RouterModule]
})

export class CreatePaymentRoutingModule { }
