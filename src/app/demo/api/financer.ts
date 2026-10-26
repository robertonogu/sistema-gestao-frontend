// Financiador: empresta dinheiro (receita "Empréstimo de Financiador"); debt é o que a empresa lhe deve
export interface Financer {
    originId: number;
    name: string;
    nif: number;
    initialBalance: number | null;
    debt: number;
}

export interface FinancerCreation {
    name: string;
    nif: number;
    initialBalance: number | null;
}
