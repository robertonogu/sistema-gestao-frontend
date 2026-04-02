import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListArticlesComponent } from './list-articles.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ListArticlesComponent },
		{ path: 'issue-article', data: { breadcrumb: 'Emitir Artigo' }, loadChildren: () => import('../issue-article/issue-article.module').then(m => m.IssueArticleModule) },
	])],
	exports: [RouterModule]
})

export class ListArticlesRoutingModule { }
