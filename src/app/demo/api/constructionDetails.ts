import { ItemCost } from "./itemCost";

export interface ConstructionDetails {
    profit: number;
    paymentValue: number;
    initialBudget: number;
    costValueWorks: number;
    differential: number;
    workItemsCost: ItemCost[];
    externalServiceItemsCost: ItemCost[];
    articlesItemsCost: ItemCost[];
}