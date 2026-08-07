import { PaymentMethod } from "../enum/paymentMethod";
import { RevenueType } from "../enum/revenueType";

export interface RevenueEdit {
    revenueId: number;
    date: Date;
    revenueType: RevenueType;
    documentNumber: string;
    netValue: number;
    iva: number;
    totalValue: number;
    paymentMethod: PaymentMethod;
    originId: number;
    accountId: number;
    constructionId: number | null;
}
