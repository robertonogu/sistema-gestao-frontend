import { PaymentStatus } from "../data/enum/paymentStatus";

export interface ExpenseListItem {
    expenseId: number;
    date: Date;
    documentNumber: string;
    categories: string[];
    paymentStatus: PaymentStatus;
    origin: string;
    totalValue: number;
    pendingValue: number;
    paymentMethods: string[];
    paymentDeadline: Date;
}
