import { BudgetSubItemCreation } from "./budgetSubItemCreation.model";

export interface BudgetItemCreation {
    name: string;
    budgetSubItems: BudgetSubItemCreation[];
}