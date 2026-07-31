import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListClientsComponent } from './list-clients.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListClientsComponent },
	])],
	exports: [RouterModule]
})

export class ListClientsRoutingModule { }
