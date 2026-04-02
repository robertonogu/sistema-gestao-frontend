import { PaymentMethod } from "../enum/paymentMethod";
import { PaymentCreation } from "./paymentCreation.model";

export interface ListPaymentCreation {
    documentNumber: string;
    date: Date;
    paymentMethod: PaymentMethod;
    accountId: number;
    paymentCreationDTOList: PaymentCreation[];
}