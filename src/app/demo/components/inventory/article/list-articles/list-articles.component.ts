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
  entriesTotal: number = 0;
  exitsTotal: number = 0;
  stockTotal: number = 0;
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

  // Separador ativo, guardado na sessão para voltar ao mesmo separador depois de abrir uma despesa
  activeTab: number = 0;
  private static readonly TAB_STORAGE_KEY = 'articles-active-tab';

  ngOnInit() {
    this.originService.getOriginNames().subscribe((origins) => {
      this.originNames = origins;
    });
    try {
      this.activeTab = Number(sessionStorage.getItem(ListArticlesComponent.TAB_STORAGE_KEY)) || 0;
    } catch {
      this.activeTab = 0;
    }
  }

  newArticleExit() {
    this.router.navigate(['./inventory/articles/article-exit']);
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
      this.entriesTotal = stockEntries.totalElements;
    });
  }

  getStockExits() {
    this.stockMovementService.getStockExits(this.currentPage, this.pageSize, this.exitsFilters).subscribe((stockExits) => {
      this.stockExits = stockExits.objectList;
      this.exitsTotal = stockExits.totalElements;
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
        this.stockTotal = articles.totalElements;
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
    this.activeTab = index;
    try {
      sessionStorage.setItem(ListArticlesComponent.TAB_STORAGE_KEY, String(index));
    } catch {
      // sem armazenamento de sessão: só não se lembra do separador
    }
  }
}
