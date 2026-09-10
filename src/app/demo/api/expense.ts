import { DocumentType } from "../data/enum/documentType";
import { PaymentStatus } from "../data/enum/paymentStatus";
import { Item } from "./item";

export interface Expense {
    expenseId: number;
    documentNumber: string;
    date: Date;
    documentType: DocumentType;
    totalValue: number;
    iva: number;
    paymentDeadline: number;
    paymentStatus: PaymentStatus;
    itemList: Item[];
    categories: string[];
    origin?: Origin;
}

interface Origin {
    name: string;
    nif?: number;
    address?: string;
}