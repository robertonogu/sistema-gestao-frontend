export interface BudgetItemCostBreakdown {
    budgetItemId: number;
    number: string;
    level: number;
    description: string;
    materials: number;
    labor: number;
    externalServices: number;
    indirect: number;
    subtotal: number;
}
