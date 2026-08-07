export interface AccountLog {
    date: Date;
    documentNumber: string;
    movementType: string;
    credit: number;
    debt: number;
    balance: number;
}