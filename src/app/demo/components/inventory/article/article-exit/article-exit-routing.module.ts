import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArticleExitComponent } from './article-exit.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ArticleExitComponent }
	])],
	exports: [RouterModule]
})

export class ArticleExitRoutingModule { }
