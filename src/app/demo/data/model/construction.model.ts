import { BudgetItem } from "./budgetItem.model";
import { Location } from "../../api/location";

export interface Construction {
    id?: number;
    name: string;
    address?: string;
    placeId?: string;
    locations?: Location[];
    clientId: number;
    adjudicationDate: Date;
    initialDate: Date;
    estimatedDays: number;
    budgetItems: BudgetItem[];
    imageUrl?: string;
}
