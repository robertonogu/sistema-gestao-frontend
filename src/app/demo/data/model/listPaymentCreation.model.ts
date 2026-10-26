import { PaymentMethod } from "../enum/paymentMethod";
import { PaymentCreation } from "./paymentCreation.model";

export interface ListPaymentCreation {
    documentNumber: string;
    date: Date;
    paymentMethod: PaymentMethod;
    accountId: number;
    // Pago por um credor (com dinheiro dele) em vez de uma conta da empresa
    creditorId?: number;
    paymentCreationDTOList: PaymentCreation[];
}