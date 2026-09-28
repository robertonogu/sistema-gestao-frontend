export interface ExpenseInDebt {
    id: number;
    date?: Date;
    paymentDeadline?: Date;
    originId: number;
    origin: string;
    documentNumber: string;
    debtValue: number;
    totalValue: number;
}