export interface Sale {
    saleId: number;
    date: Date;
    documentNumber: string;
    netValue: number;
    iva: number;
    totalValue: number;
    client: string;
    clientId: number;
    construction: string | null;
    constructionId: number | null;
}