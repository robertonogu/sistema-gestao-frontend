import { MovementType } from "../data/enum/movementType";

export interface AccountLog {
    date: Date;
    documentNumber: string;
    movementType: MovementType;
    credit: number;
    debt: number;
    balance: number;
}