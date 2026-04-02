import { PaymentMethod } from "../enum/paymentMethod";
import { RevenueType } from "../enum/revenueType";

export class RevenueCreation {
    date: Date;
    revenueType: RevenueType;
    documentNumber: string;
    originId: number;
    accountId: number;
    paymentMethod: PaymentMethod;
    value: number;
    iva: number;
    constructionId: number;

    constructor(
        date: Date, 
        revenueType: RevenueType, 
        documentNumber: string, 
        originId: number, 
        accountId: number, 
        paymentMethod: PaymentMethod, 
        value: number, 
        iva: number,  
        constructionId: number
    ) {
        this.date = date;
        this.revenueType = revenueType;
        this.documentNumber = documentNumber;
        this.originId = originId;
        this.accountId = accountId;
        this.paymentMethod = paymentMethod;
        this.value = value;
        this.iva = iva;
        this.constructionId = constructionId;
    }
  
}