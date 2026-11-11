import { PaymentMethod } from "../data/enum/paymentMethod";
import { OriginType } from "./originType";

export interface Payment {
    paymentDocumentId: number;
    date: Date;
    documentNumber: string | null;
    origin: string | null;
    originType: OriginType | null;
    invoices: string;
    value: number;
    paymentMethod: PaymentMethod;
    account: string;
}

export interface PaymentDocumentLine {
    expenseId: number;
    documentNumber: string;
    date: string;
    paymentDeadline: string;
    totalValue: number;
    debtValue: number;
    paidValue: number;
}

export interface PaymentDocumentDetail {
    paymentDocumentId: number;
    documentNumber: string | null;
    date: string;
    paymentMethod: string;
    accountId: number | null;
    creditorId?: number | null;
    originId: number;
    value: number;
    roundingFavorable: number;
    roundingUnfavorable: number;
    postedToCurrentAccount?: boolean;
    lines: PaymentDocumentLine[];
}

export interface ExpensePayment {
    paymentDocumentId: number;
    date: string;
    documentNumber: string | null;
    paymentMethod: string;
    account: string;
    value: number;
    documentValue: number;
}
