export interface WorkLogCreation {
    date: Date;
    hours: number;
    workOnConstruction: boolean;
    constructionId: number;
    budgetItemId: number;
    employeeId: number;
}