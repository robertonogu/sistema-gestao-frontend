import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleStock } from 'src/app/demo/api/articleStock';
import { StockMovement } from 'src/app/demo/api/stockMovement';
import { ArticleFamily } from 'src/app/demo/data/enum/articleFamily';
import { StockMovementService } from 'src/app/demo/service/inventory/stockMovement.service';

@Component({
  templateUrl: './list-articles.component.html',
  providers: [DatePipe],
})
export class ListArticlesComponent {

  stockEntries!: StockMovement[];
  stockExits!: StockMovement[];
  articlesStock!: ArticleStock[];
  pageSize: number = 20;
  currentPage: number = 0;
  totalRecords: number = 0;

  date!: Date;

  ArticleFamily = ArticleFamily;

  constructor(
    private stockMovementService: StockMovementService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getStockEntries();
  }

  issueArticle() {
    this.router.navigate(['./inventory/articles/issue-article']);
  }

  getStockEntries() {
    this.stockMovementService.getStockEntries(this.currentPage, this.pageSize).subscribe((stockEntries) => {
      this.stockEntries = stockEntries.objectList;
      this.totalRecords = stockEntries.totalElements;
    });
  }

  getStockExits() {
    this.stockMovementService.getStockExits(this.currentPage, this.pageSize).subscribe((stockExits) => {
      this.stockExits = stockExits.objectList;
      this.totalRecords = stockExits.totalElements;
    });
  }

  getStockAsOfDate() {
    let dt = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    if (dt != null) {
      this.stockMovementService.getStockAsOfDate(dt, this.currentPage, this.pageSize).subscribe((articles) => {
        this.articlesStock = articles.objectList;
      });
    }
  }

  handleChange(e: any) {
    var index = e.index;
    if (index == 1) {
      this.getStockExits();
    }
    else if (index == 2) {
      this.getStockAsOfDate();
    }
    else {
      this.getStockEntries();
    }
  }
}
