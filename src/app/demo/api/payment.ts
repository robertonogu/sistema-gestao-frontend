import { PaymentMethod } from "../data/enum/paymentMethod";

// Documento de pagamento na listagem: um pagamento que pode liquidar várias faturas
export interface Payment {
    paymentDocumentId: number;
    date: Date;
    documentNumber: string | null;
    origin: string | null;
    invoices: string;
    value: number;
    paymentMethod: PaymentMethod;
    account: string;
}

// Fatura que pode ser paga no documento; debtValue já exclui o que este documento paga
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
    accountId: number;
    originId: number;
    value: number;
    lines: PaymentDocumentLine[];
}

// Pagamento de uma despesa: o documento e quanto dele foi para esta fatura
export interface ExpensePayment {
    paymentDocumentId: number;
    date: string;
    documentNumber: string | null;
    paymentMethod: string;
    account: string;
    value: number;
    documentValue: number;
}
