export interface Movement {
    movementId: number;
    date: Date;
    originAccount: string;
    originAccountId: number;
    targetAccount: string;
    targetAccountId: number;
    value: number;
}