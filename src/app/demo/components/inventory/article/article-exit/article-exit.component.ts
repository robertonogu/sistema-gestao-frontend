import { DatePipe, Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { Article } from 'src/app/demo/api/article';
import { BudgetItem } from 'src/app/demo/api/budgetItem';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { StockExitCreation, StockExitItem } from 'src/app/demo/data/model/stockExitCreation.model';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { StockMovementService } from 'src/app/demo/service/inventory/stockMovement.service';

@Component({
  templateUrl: './article-exit.component.html',
  providers: [MessageService, DatePipe]
})
export class ArticleExitComponent {

  constructionNames!: ConstructionNames[];
  budgetTree: TreeNode[] = [];
  selectedBudgetNode?: TreeNode;

  date: Date = new Date();
  selectedConstruction!: number;

  // Uma linha por artigo em stock (cada linha de fatura tem o seu artigo e documento)
  articles: Article[] = [];
  articleQuantities: (number | null)[] = [];

  saving: boolean = false;

  constructor(
    private messageService: MessageService,
    private stockMovementService: StockMovementService,
    private constructionService: ConstructionService,
    private _location: Location,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.constructionService.getConstructionNames().subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });

    this.loadStock();
  }

  back() {
    this._location.back();
  }

  loadStock() {
    const date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    if (date == null) return;

    this.stockMovementService.getStockAsOfDate(date, 0, 1000).subscribe((articles) => {
      this.articles = articles.objectList;
      this.articleQuantities = this.articles.map(() => null);
    });
  }

  getSubItems() {
    this.selectedBudgetNode = undefined;
    this.constructionService.getBudgetItemsForConstruction(this.selectedConstruction).subscribe((budgetItems) => {
      this.budgetTree = this.mapBudgetItemsToTreeNodes(budgetItems);
    });
  }

  private mapBudgetItemsToTreeNodes(budgetItems: BudgetItem[]): TreeNode[] {
    return budgetItems.map((budgetItem) => ({
      key: budgetItem.id.toString(),
      label: budgetItem.name,
      data: budgetItem.id,
      children: budgetItem.children?.length ? this.mapBudgetItemsToTreeNodes(budgetItem.children) : undefined
    }));
  }

  exceedsStock(i: number): boolean {
    const quantity = this.articleQuantities[i];
    return quantity != null && quantity > this.articles[i].quantity;
  }

  saveStockExit() {
    if (!this.date || !this.selectedConstruction || !this.selectedBudgetNode) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
      return;
    }

    if (this.articles.some((_, i) => this.exceedsStock(i))) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem quantidades a sair superiores ao stock.' });
      return;
    }

    const items: StockExitItem[] = [];
    this.articles.forEach((article, i) => {
      const quantity = this.articleQuantities[i];
      if (quantity != null && quantity > 0) {
        items.push({ articleId: article.articleId, quantity: quantity });
      }
    });

    if (items.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Indique a quantidade a sair de pelo menos um artigo.' });
      return;
    }

    const stockExit: StockExitCreation = { date: this.date, budgetItemId: this.selectedBudgetNode.data, items: items };

    this.saving = true;
    this.stockMovementService.createStockExits(stockExit).subscribe({
      next: () => {
        this.saving = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Saída de artigos registada com sucesso.' });
        this.loadStock();
      },
      error: (err) => {
        this.saving = false;
        const detail = err.error?.message || 'Não foi possível registar a saída de artigos.';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail });
      }
    });
  }
}
