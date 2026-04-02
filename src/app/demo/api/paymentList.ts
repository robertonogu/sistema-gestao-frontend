import { Payment } from "./payment";

export interface PaymentList {
    objectList: Payment[],
    totalElements: number,
    totalPages: number
}