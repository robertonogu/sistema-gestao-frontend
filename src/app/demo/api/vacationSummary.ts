// Vacation days of one year: carried over from the previous year and this year's entitlement (working days)
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
    // Only the first tracked year takes the carried over days by hand
    carriedOverEditable: boolean;
}
