import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListExternalEntitiesComponent } from './list-external-entities.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListExternalEntitiesComponent },
	])],
	exports: [RouterModule]
})

export class ListExternalEntitiesRoutingModule { }
