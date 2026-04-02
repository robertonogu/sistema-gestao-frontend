import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from 'src/app/demo/api/article';
import { IssuedArticle } from 'src/app/demo/api/issuedArticle';
import { ArticleFamily } from 'src/app/demo/data/enum/articleFamily';
import { ArticleService } from 'src/app/demo/service/inventory/article.service';
import { IssuedArticleService } from 'src/app/demo/service/inventory/issuedArticle.service';

@Component({
  templateUrl: './list-articles.component.html',
  providers: [DatePipe],
})
export class ListArticlesComponent {

  articles!: Article[];
  issuedArticles!: IssuedArticle[];
  articlesStock!: Article[];
  pageSize: number = 5;
  currentPage: number = 0;
  totalRecords: number = 0;

  date!: Date;

  ArticleFamily = ArticleFamily;

  constructor(
    private articleService: ArticleService,
    private issuedArticleService: IssuedArticleService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getEntryArticles();
  }

  issueArticle() {
    this.router.navigate(['./inventory/articles/issue-article']);
  }

  getEntryArticles() {
    this.articleService.getArticles(this.currentPage, this.pageSize).subscribe((articles) => {
      this.articles = articles.objectList;
      this.totalRecords = this.totalRecords;
      console.log(this.articles)
    });
  }

  getIssuedArticles() {
    this.issuedArticleService.getIssuedArticles(this.currentPage, this.pageSize).subscribe((issuedArticles) => {
      this.issuedArticles = issuedArticles.objectList;
      this.totalRecords = this.totalRecords;
    });
  }

  getStockAsOfDate() {
    console.log(this.date);
    let dt = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    if (dt != null) {
      this.articleService.findStockAsOfDate(dt).subscribe((articles) => {
        this.articlesStock = articles.objectList;
        console.log(this.articlesStock)
      });
    }
  }

  handleChange(e: any) {
    var index = e.index;
    if (index == 1) {
      this.getIssuedArticles();
    }
    else if (index == 2) {
      //this.getStockArticles();
    }
    else {
      this.getEntryArticles();
    }
  }
}
