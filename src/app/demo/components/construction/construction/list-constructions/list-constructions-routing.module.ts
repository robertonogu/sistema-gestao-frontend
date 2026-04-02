import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListConstructionsComponent } from './list-constructions.component';
import { DetailsConstructionComponent } from '../details-construction/details-construction.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListConstructionsComponent },
		{ path: 'create-construction', data: { breadcrumb: 'Nova Obra' }, loadChildren: () => import('../create-construction/create-construction.module').then(m => m.CreateConstructionModule) },
		{ path: 'details/:constructionId', data: { breadcrumb: 'Detalhes Obra' }, loadChildren: () => import('../details-construction/details-construction.module').then(m => m.DetailsConstructionModule) },
	])],
	exports: [RouterModule]
})

export class ListConstructionsRoutingModule { }
