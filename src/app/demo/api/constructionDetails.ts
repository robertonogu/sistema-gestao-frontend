import { CashflowMonth } from './cashflowMonth';
import { ConstructionCalendarEvent } from './constructionCalendarEvent';
import { ItemCost } from './itemCost';

export interface ConstructionDetails {
    profit: number;
    paymentValue: number;
    initialBudget: number;
    costValueWorks: number;
    differential: number;
    workItemsCost: ItemCost[];
    externalServiceItemsCost: ItemCost[];
    articlesItemsCost: ItemCost[];
    name: string;
    constructionNumber: string;
    status: string;
    client: string;
    address: string;
    adjudicationDate: string;
    endDate: string;
    margin: number;
    invoicedValue: number;
    estimatedProfit: number;
    daysElapsed: number;
    totalDays: number;
    cashflowData: CashflowMonth[];
    calendarEvents: ConstructionCalendarEvent[];
}
