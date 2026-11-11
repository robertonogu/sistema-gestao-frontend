import { PaymentMethod } from "../enum/paymentMethod";
import { PaymentCreation } from "./paymentCreation.model";

export interface ListPaymentCreation {
    documentNumber: string;
    date: Date;
    paymentMethod: PaymentMethod;
    accountId: number;
    creditorId?: number;
    roundingFavorable?: number;
    roundingUnfavorable?: number;
    postedToCurrentAccount?: boolean;
    paymentCreationDTOList: PaymentCreation[];
}