import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListArticlesComponent } from './list-articles.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListArticlesComponent },
		{ path: 'article-exit', data: { breadcrumb: 'Nova Saída de Artigos' }, loadChildren: () => import('../article-exit/article-exit.module').then(m => m.ArticleExitModule) },
	])],
	exports: [RouterModule]
})

export class ListArticlesRoutingModule { }
