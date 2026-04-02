export interface Revenue {
    date: Date;
    revenueType: string;
    documentNumber: string;
    origin: string;
    description: string;
    value: number;
    iva: number;
    totalValue: number;
    accountName: string;
    paymentMethod: string;
}