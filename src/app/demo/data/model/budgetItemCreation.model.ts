export interface BudgetItemCreation {
    name: string;
    laborCost: number;
    materialsCost: number;
    externalServicesCost: number;
    indirectCost: number;
    children?: BudgetItemCreation[];
}
