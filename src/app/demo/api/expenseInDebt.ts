import { OriginType } from "./originType";

export interface ExpenseInDebt {
    id: number;
    date?: Date;
    paymentDeadline?: Date;
    originId: number;
    origin: string;
    originType?: OriginType | null;
    documentNumber: string;
    debtValue: number;
    totalValue: number;
}