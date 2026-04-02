export interface ExpenseInDebt {
    id: number;
    paymentDeadline?: Date;
    origin: string;
    documentNumber: string;
    debtValue: number;
    totalValue: number;
}