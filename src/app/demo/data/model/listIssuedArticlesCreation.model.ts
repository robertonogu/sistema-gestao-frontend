import { IssuedArticleCreation } from "./issuedArticleCreation.model";

export interface ListIssuedArticlesCreation {
    date: Date;
    constructionId: number;
    budgetSubItemId: number;
    issuedArticlesList: IssuedArticleCreation[];
}