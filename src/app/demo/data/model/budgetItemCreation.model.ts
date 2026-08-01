export interface BudgetItemCreation {
    name: string;
    laborCost: number;
    materialCost: number;
    externalServiceCost: number;
    indirectCost: number;
    children?: BudgetItemCreation[];
}
