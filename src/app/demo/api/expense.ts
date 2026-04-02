import { DocumentType } from "../data/enum/documentType";
import { PaymentStatus } from "../data/enum/paymentStatus";

export interface Expense {
    expenseId: number;
    documentNumber: string;
    date: Date;
    category: string;
    subCategory: string;
    documentType: DocumentType;
    totalValue: number;
    iva: number;
    paymentDeadline: number;
    paymentStatus: PaymentStatus;
}