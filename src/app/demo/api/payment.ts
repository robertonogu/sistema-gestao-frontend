import { PaymentMethod } from "../data/enum/paymentMethod";

export interface Payment {
    date: Date;
    documentNumber: string;
    value: number;
    paymentMethod: PaymentMethod;
    account: string;
}