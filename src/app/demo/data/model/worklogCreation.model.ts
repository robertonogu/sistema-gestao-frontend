export interface WorkLogCreation {
    date: Date;
    hours: number;
    workOnConstruction: boolean;
    constructionId: number;
    budgetSubItemId: number;
    employeeId: number;
}