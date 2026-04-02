import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListMovementsComponent } from './list-movements/list-movements.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListMovementsComponent },
	])],
	exports: [RouterModule]
})
export class MovementRoutingModule { }
