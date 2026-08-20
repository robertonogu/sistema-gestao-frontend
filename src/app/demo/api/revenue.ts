export interface Revenue {
    revenueId: number;
    date: Date;
    revenueType: string;
    documentNumber: string;
    origin: string;
    originId: number;
    netValue: number;
    iva: number;
    totalValue: number;
    accountName: string;
    accountId: number;
    paymentMethod: string;
    saleId: number | null;
}