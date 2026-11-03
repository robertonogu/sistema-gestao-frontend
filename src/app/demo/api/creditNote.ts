export interface CreditableExpense {
    expenseId: number;
    documentNumber: string;
    date: Date;
    totalValue: number;
    amountDue: number;
}

export interface ReturnableAllocation {
    budgetItemId: number;
    budgetItemName: string;
    constructionName: string | null;
    quantity: number;
}

export interface ReturnableItem {
    expenseItemId: number;
    expenseId: number;
    documentNumber: string;
    date: Date;
    name: string;
    subCategoryType: string;
    unit: string;
    iva: number;
    unitValue: number;
    quantity: number;
    returnableQuantity: number;
    stockQuantity: number;
    allocations: ReturnableAllocation[];
}
