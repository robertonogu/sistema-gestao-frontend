import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListPaymentsComponent } from './list-payments.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListPaymentsComponent },
		{ path: 'create-payment', data: { breadcrumb: 'Novo Pagamento' }, loadChildren: () => import('../create-payment/create-payment.module').then(m => m.CreatePaymentModule) },
	])],
	exports: [RouterModule]
})

export class ListPaymentsRoutingModule { }
