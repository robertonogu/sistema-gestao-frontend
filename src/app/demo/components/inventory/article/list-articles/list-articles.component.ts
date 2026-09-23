import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleStock } from 'src/app/demo/api/articleStock';
import { ItemName } from 'src/app/demo/api/itemName';
import { StockMovement } from 'src/app/demo/api/stockMovement';
import { ArticleFamily } from 'src/app/demo/data/enum/articleFamily';
import { OriginService } from 'src/app/demo/service/company/originService';
import { StockMovementFilters, StockMovementService } from 'src/app/demo/service/inventory/stockMovement.service';

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
  originNames: ItemName[] = [];

  entriesFilters: StockMovementFilters = {};
  exitsFilters: StockMovementFilters = {};
  stockFilters: StockMovementFilters = {};

  date: Date = new Date();

  ArticleFamily = ArticleFamily;

  constructor(
    private stockMovementService: StockMovementService,
    private originService: OriginService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.originService.getOriginNames().subscribe((origins) => {
      this.originNames = origins;
    });
    this.getStockEntries();
  }

  issueArticle() {
    this.router.navigate(['./inventory/articles/issue-article']);
  }

  editExpense(expenseId: number) {
    this.router.navigate(['/transactions/expenses/edit-expense', expenseId]);
  }

  private filterValue(filters: any, field: string) {
    const meta = Array.isArray(filters?.[field]) ? filters[field][0] : filters?.[field];
    return meta?.value ?? undefined;
  }

  private buildFilters(filters: any): StockMovementFilters {
    return {
      documentNumber: this.filterValue(filters, 'documentNumber'),
      originId: this.filterValue(filters, 'origin'),
      itemName: this.filterValue(filters, 'itemName')
    };
  }

  getStockEntries() {
    this.stockMovementService.getStockEntries(this.currentPage, this.pageSize, this.entriesFilters).subscribe((stockEntries) => {
      this.stockEntries = stockEntries.objectList;
      this.totalRecords = stockEntries.totalElements;
    });
  }

  getStockExits() {
    this.stockMovementService.getStockExits(this.currentPage, this.pageSize, this.exitsFilters).subscribe((stockExits) => {
      this.stockExits = stockExits.objectList;
      this.totalRecords = stockExits.totalElements;
    });
  }

  onEntriesLazyLoad(event: any) {
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.entriesFilters = this.buildFilters(event.filters);
    this.getStockEntries();
  }

  onExitsLazyLoad(event: any) {
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.exitsFilters = this.buildFilters(event.filters);
    this.getStockExits();
  }

  getStockAsOfDate() {
    let dt = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    if (dt != null) {
      this.stockMovementService.getStockAsOfDate(dt, this.currentPage, this.pageSize, this.stockFilters).subscribe((articles) => {
        this.articlesStock = articles.objectList;
        this.totalRecords = articles.totalElements;
      });
    }
  }

  onStockLazyLoad(event: any) {
    this.currentPage = event.first / event.rows;
    this.pageSize = event.rows;
    this.stockFilters = this.buildFilters(event.filters);
    this.getStockAsOfDate();
  }

  handleChange(e: any) {
    var index = e.index;
    this.currentPage = 0;
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
