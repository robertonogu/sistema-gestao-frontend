export interface StockMovement {
    stockMovementId: number;
    type: string;
    quantity: number;
    date: Date;
    articleCode: string;
    articleName: string;
    unit: string;
    unitValue: number;
    totalValue: number;
    constructionName: string | null;
}
