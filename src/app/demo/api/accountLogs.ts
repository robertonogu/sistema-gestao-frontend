export interface AccountLog {
    date: Date;
    documentNumber: string;
    movementType: string;
    origin?: string;
    credit: number;
    debt: number;
    balance: number;
}