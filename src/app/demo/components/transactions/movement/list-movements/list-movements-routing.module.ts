import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListMovementsComponent } from './list-movements.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListMovementsComponent },
		{ path: 'create-movement', data: { breadcrumb: 'Novo Movimento' }, loadChildren: () => import('../create-movement/create-movement.module').then(m => m.CreateMovementModule) },
	])],
	exports: [RouterModule]
})

export class ListMovementsRoutingModule { }
