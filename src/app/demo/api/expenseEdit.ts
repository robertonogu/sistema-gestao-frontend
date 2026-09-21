import { DocumentType } from "../data/enum/documentType";
import { PaymentCondition } from "../data/enum/paymentCondition";

export interface CostAllocationEdit {
    budgetItemId: number;
    quantity: number;
}

export interface ExpenseItemEdit {
    expenseItemId: number;
    subCategoryType: string;
    name: string;
    quantity: number;
    unit: string;
    netValue: number;
    iva: number;
    totalValue: number;
    vehicleId?: number;
    toolId?: number;
    equipmentId?: number;
    constructionId?: number;
    costAllocations: CostAllocationEdit[];
}

export interface ExpenseEdit {
    expenseId: number;
    date: Date;
    documentType: DocumentType;
    documentNumber: string;
    originId?: number;
    netValue: number;
    iva: number;
    totalValue: number;
    paymentCondition: PaymentCondition;
    paymentDeadline?: Date;
    itemList: ExpenseItemEdit[];
}
