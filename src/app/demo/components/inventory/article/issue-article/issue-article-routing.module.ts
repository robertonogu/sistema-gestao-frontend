import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IssueArticleComponent } from './issue-article.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: IssueArticleComponent }
	])],
	exports: [RouterModule]
})

export class IssueArticleRoutingModule { }
