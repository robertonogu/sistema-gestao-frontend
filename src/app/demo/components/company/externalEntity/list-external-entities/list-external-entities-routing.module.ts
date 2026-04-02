import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListExternalEntitiesComponent } from './list-external-entities.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListExternalEntitiesComponent },
		{ path: 'create-externalEntity', data: { breadcrumb: 'Criar Entidade Externa'}, loadChildren: () => import('../create-external-entity/create-external-entity.module').then(m => m.CreateExternalEntityModule) },
	])],
	exports: [RouterModule]
})

export class ListExternalEntitiesRoutingModule { }
