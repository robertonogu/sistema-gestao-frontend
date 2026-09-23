import { PaymentMethod } from "../data/enum/paymentMethod";

export interface Payment {
    date: Date;
    documentNumber: string;
    origin: string | null;
    value: number;
    paymentMethod: PaymentMethod;
    account: string;
}