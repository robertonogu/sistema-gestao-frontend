import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListToolsComponent } from './list-tools.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListToolsComponent },
		{ path: 'create-tool', data: { breadcrumb: 'Nova Ferramenta' }, loadChildren: () => import('../create-tool/create-tool.module').then(m => m.CreateToolModule) },
	])],
	exports: [RouterModule]
})

export class ListToolsRoutingModule { }
