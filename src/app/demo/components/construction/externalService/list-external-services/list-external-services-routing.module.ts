import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListExternalServicesComponent } from './list-external-services.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListExternalServicesComponent }
	])],
	exports: [RouterModule]
})

export class ListExternalServicesRoutingModule { }
