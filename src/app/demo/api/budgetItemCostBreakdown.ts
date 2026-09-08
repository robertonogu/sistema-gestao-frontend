export interface BudgetItemCostBreakdown {
    budgetItemId: number;
    description: string;
    materials: number;
    labor: number;
    externalServices: number;
    indirect: number;
    subtotal: number;
}
