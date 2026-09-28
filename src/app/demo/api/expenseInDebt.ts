export interface ExpenseInDebt {
    id: number;
    date?: Date;
    paymentDeadline?: Date;
    origin: string;
    documentNumber: string;
    debtValue: number;
    totalValue: number;
}