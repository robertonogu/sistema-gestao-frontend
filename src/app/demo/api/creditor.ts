export interface Creditor {
    originId: number;
    name: string;
    nif: number;
    initialBalance: number | null;
    debt: number;
    active: boolean;
}

export interface CreditorCreation {
    name: string;
    nif: number;
    initialBalance: number | null;
}
