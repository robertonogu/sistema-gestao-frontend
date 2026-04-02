import { DatePipe, Location } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Article } from 'src/app/demo/api/article';
import { ConstructionNames } from 'src/app/demo/api/constructionNames';
import { ExpenseInDebt } from 'src/app/demo/api/expenseInDebt';
import { ItemName } from 'src/app/demo/api/itemName';
import { ObjectName } from 'src/app/demo/api/objectName';
import { Origin } from 'src/app/demo/api/origin';
import { PaymentMethod } from 'src/app/demo/data/enum/paymentMethod';
import { IssuedArticleCreation } from 'src/app/demo/data/model/issuedArticleCreation.model';
import { ListIssuedArticlesCreation } from 'src/app/demo/data/model/listIssuedArticlesCreation.model';
import { ListPaymentCreation } from 'src/app/demo/data/model/listPaymentCreation.model';
import { PaymentCreation } from 'src/app/demo/data/model/paymentCreation.model';
import { RevenueCreation } from 'src/app/demo/data/model/revenueCreation.model';
import { AccountService } from 'src/app/demo/service/company/accountService';
import { OriginService } from 'src/app/demo/service/company/originService';
import { ConstructionService } from 'src/app/demo/service/construction/constructionService';
import { ArticleService } from 'src/app/demo/service/inventory/article.service';
import { IssuedArticleService } from 'src/app/demo/service/inventory/issuedArticle.service';
import { ExpenseService } from 'src/app/demo/service/transactions/expense.service';
import { PaymentService } from 'src/app/demo/service/transactions/paymentService';

@Component({
  templateUrl: './issue-article.component.html',
  providers: [MessageService, DatePipe]
})
export class IssueArticleComponent {

  constructionNames!: ConstructionNames[];
  subItems!: ItemName[];

  date!: Date;
  selectedConstruction!: number;
  selectedSubItem!: number;
  articles!: Article[];
  
  articlesSelected: Article[] = [];
  articleQuantities: number[] = [];

  revenue!: RevenueCreation;

  payments!: ListPaymentCreation;
  sumTotalValues: number = 0;
  paymentCreationDTOList: PaymentCreation[] = [];

  constructor(
    private messageService: MessageService,
    private articleService: ArticleService,
    private constructionService: ConstructionService,
    private issuedArticleService: IssuedArticleService,
    private _location: Location,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.constructionService.getConstructionNames().subscribe((constructionNames) => {
      this.constructionNames = constructionNames;
    });
    this.articleService.findStockToday().subscribe((articles) => {
      this.articles = articles.objectList;
      this.articleQuantities = this.articles.map(() => 0); 
    });
  }

  back() {
    this._location.back();
  }

  getSubItems() {
    this.constructionService.getBudgetSubItemsForConstruction(this.selectedConstruction).subscribe((subItems) => {
      this.subItems = subItems;
    });
  }

  newIssueArticle() {
    let issuedArticlesList: IssuedArticleCreation[] = [];
    for (let i = 0; i < this.articleQuantities.length; i++) {
      if (this.articleQuantities[i] != 0) {
        const issuedArticle = { articleId: this.articles[i].articleId, quantity: this.articleQuantities[i] } as IssuedArticleCreation;
        issuedArticlesList.push(issuedArticle);
      }
    }

    const issuedArticles = { date: this.date, constructionId: this.selectedConstruction, budgetSubItemId: this.selectedSubItem, issuedArticlesList: issuedArticlesList } as ListIssuedArticlesCreation;
    if (issuedArticles != null) {
      this.issuedArticleService.issueArticles(issuedArticles).subscribe(newIssuedArticles => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pagamento(s) registado(s) com sucesso.' });
      })      
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Existem campos por preencher.' });
    }
  }
}
