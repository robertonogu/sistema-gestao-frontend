export interface BudgetItem {
    budgetItemId?: number;
    name: string;
    laborCost: number;
    materialCost: number;
    externalServiceCost: number;
    indirectCost: number;
    isExtra: boolean;
    children?: BudgetItem[];
}
