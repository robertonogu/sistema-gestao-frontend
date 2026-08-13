import { BudgetItem } from "./budgetItem.model";

export interface Construction {
    id?: number;
    name: string;
    address: string;
    placeId: string;
    clientId: number;
    adjudicationDate: Date;
    initialDate: Date;
    estimatedDays: number;
    budgetItems: BudgetItem[];
    imageUrl?: string;
}
