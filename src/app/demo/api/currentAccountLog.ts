import { PaymentMethod } from "../data/enum/paymentMethod";

export interface CurrentAccountLog {
    date: Date;
    documentNumber: string;
    paymentMethod: PaymentMethod;
    description: string;
    credit: number;
    debt: number;
    balance: number;
}