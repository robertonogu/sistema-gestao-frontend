export interface VacationSummary {
    year: number;
    carriedOverDays: number;
    carriedOverUsed: number;
    carriedOverRemaining: number;
    entitledDays: number;
    currentUsed: number;
    currentRemaining: number;
    totalUsed: number;
    maxDaysPerYear: number;
    carriedOverEditable: boolean;
}
