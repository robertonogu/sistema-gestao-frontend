import { DocumentType } from "../enum/documentType";
import { PaymentMethod } from "../enum/paymentMethod";
import { ItemCreation } from "./itemCreation.model";

export interface ExpenseCreation {
    date: Date;
    originId: number;
    documentType: DocumentType;
    documentNumber: string;
    paymentDeadline: Date;
    netValue: number;
    iva: number;
    totalValue: number;
    isIntegralPayment: boolean;
    paymentValue: number;
    accountId: number;
    paymentMethod: PaymentMethod;
    itemList: ItemCreation[];
}
