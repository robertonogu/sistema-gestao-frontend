import { PaymentMethod } from "../enum/paymentMethod";
import { RevenueType } from "../enum/revenueType";
import { RevenueSaleLine } from "./revenueSalesSelection";

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
    // Vendas liquidadas pela receita e valor recebido de cada uma
    sales: RevenueSaleLine[];

    constructor(
        date: Date,
        revenueType: RevenueType,
        documentNumber: string,
        originId: number,
        accountId: number,
        paymentMethod: PaymentMethod,
        totalValue: number,
        iva: number,
        saleId: number,
        sales: RevenueSaleLine[] = []
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
        this.sales = sales;
    }

}
