// Invoice a credit note can credit; amountDue is what is still to pay (already without other credit notes)
export interface CreditableExpense {
    expenseId: number;
    documentNumber: string;
    date: Date;
    totalValue: number;
    amountDue: number;
}

// Net quantity of a purchase line allocated to a construction budget item
export interface ReturnableAllocation {
    budgetItemId: number;
    budgetItemName: string;
    constructionName: string | null;
    quantity: number;
}

// Stock purchase line that can still be returned to the supplier: the returned material leaves the stock
// (up to stockQuantity) and/or comes back from the constructions it was allocated to
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
