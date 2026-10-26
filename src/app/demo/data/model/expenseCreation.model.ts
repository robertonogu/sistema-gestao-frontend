import { DocumentType } from "../enum/documentType";
import { PaymentCondition } from "../enum/paymentCondition";
import { PaymentMethod } from "../enum/paymentMethod";
import { ItemCreation } from "./itemCreation.model";

export interface ExpenseCreation {
    date: Date;
    originId: number;
    documentType: DocumentType;
    documentNumber: string;
    paymentCondition: PaymentCondition;
    paymentDeadline?: Date;
    netValue: number;
    iva: number;
    totalValue: number;
    isIntegralPayment: boolean;
    paymentValue: number;
    accountId: number;
    paymentMethod: PaymentMethod;
    itemList: ItemCreation[];
    // Credit note: invoice it credits
    creditedExpenseId?: number;
    // Payment on creation made by a creditor (with their own money) instead of a company account
    creditorId?: number;
}
