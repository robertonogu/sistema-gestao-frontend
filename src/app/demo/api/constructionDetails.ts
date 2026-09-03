import { CashflowMonth } from './cashflowMonth';
import { ConstructionCalendarEvent } from './constructionCalendarEvent';
import { ItemCost } from './itemCost';

export interface ConstructionDetails {
    profit: number;
    paymentValue: number;
    initialBudget: number;
    costValueWorks: number;
    workItemsCost: ItemCost[];
    externalServiceItemsCost: ItemCost[];
    articlesItemsCost: ItemCost[];
    mealsCost: number;
    name: string;
    constructionNumber: string;
    status: string;
    client: string;
    address: string;
    initialDate: string;
    adjudicationDate: string;
    endDate: string;
    margin: number;
    invoicedNetValue: number;
    daysElapsed: number; 
    totalDays: number; 
    timeProgress: number;
    cashflowData: CashflowMonth[];
    calendarEvents: ConstructionCalendarEvent[];
    imageUrl?: string;
}
