import { Unit } from "../enum/unit";
import { BudgetSubItemCreation } from "./budgetSubItemCreation.model";

export interface BudgetItemCreation {
    name: string;
    quantity: number;
    unit: Unit;
    budgetSubItems: BudgetSubItemCreation[];
}