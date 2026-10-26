export interface SaleCreation {
    date: Date;
    clientId: number;
    documentNumber: string;
    constructionId: number;
    netValue: number;
    iva: number;
    // Nota de crédito ao cliente: o valor é indicado positivo e guardado negativo; creditedSaleId é a venda creditada
    creditNote?: boolean;
    creditedSaleId?: number | null;
}