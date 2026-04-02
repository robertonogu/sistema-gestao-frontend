import { BudgetItemCreation } from "./budgetItemCreation.model";

export interface ConstructionCreation {
    name: string;
    local: string;
    clientId: number;
    adjudicationDate: Date;
    distance: number;
    budgetItems: BudgetItemCreation[];
}