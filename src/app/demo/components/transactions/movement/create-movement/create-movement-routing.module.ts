import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateMovementComponent } from './create-movement.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateMovementComponent }
	])],
	exports: [RouterModule]
})

export class CreateMovementRoutingModule { }
