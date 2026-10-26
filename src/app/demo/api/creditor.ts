// Credor: paga despesas da empresa com dinheiro dele (aparece junto das contas); debt é o que a empresa lhe deve
export interface Creditor {
    originId: number;
    name: string;
    nif: number;
    initialBalance: number | null;
    debt: number;
}

export interface CreditorCreation {
    name: string;
    nif: number;
    initialBalance: number | null;
}
