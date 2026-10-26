export interface SaleForRevenue {
    saleId: number;
    documentNumber: string;
    ivaRate: number;
    constructionId: number;
    constructionName: string;
    pendingValue: number;
    // Valor sem IVA da venda
    netValue?: number;
}
