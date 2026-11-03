export interface Financer {
    originId: number;
    name: string;
    nif: number;
    initialBalance: number | null;
    debt: number;
    active: boolean;
}

export interface FinancerCreation {
    name: string;
    nif: number;
    initialBalance: number | null;
}
