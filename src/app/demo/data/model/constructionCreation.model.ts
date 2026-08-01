import { BudgetItemCreation } from "./budgetItemCreation.model";

export interface ConstructionCreation {
    name: string;
    address: string;
    clientId: number;
    adjudicationDate: Date;
    initialDate: Date;
    estimatedDays: number;
    distance: number;
    budgetItems: BudgetItemCreation[];
}