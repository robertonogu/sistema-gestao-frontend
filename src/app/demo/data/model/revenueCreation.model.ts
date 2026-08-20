import { PaymentMethod } from "../enum/paymentMethod";
import { RevenueType } from "../enum/revenueType";

export class RevenueCreation {
    date: Date;
    revenueType: RevenueType;
    documentNumber: string;
    originId: number;
    accountId: number;
    paymentMethod: PaymentMethod;
    totalValue: number;
    iva: number;
    saleId: number;

    constructor(
        date: Date,
        revenueType: RevenueType,
        documentNumber: string,
        originId: number,
        accountId: number,
        paymentMethod: PaymentMethod,
        totalValue: number,
        iva: number,
        saleId: number
    ) {
        this.date = date;
        this.revenueType = revenueType;
        this.documentNumber = documentNumber;
        this.originId = originId;
        this.accountId = accountId;
        this.paymentMethod = paymentMethod;
        this.totalValue = totalValue;
        this.iva = iva;
        this.saleId = saleId;
    }

}
