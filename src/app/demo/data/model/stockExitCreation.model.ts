export interface StockExitItem {
    articleId: number;
    quantity: number;
}

export interface StockExitCreation {
    date: Date;
    budgetItemId: number;
    items: StockExitItem[];
}
