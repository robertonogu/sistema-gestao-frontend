import { LocalType } from "../data/enum/localType";

export interface WorkLog {
    workLogId: number;
    date: Date;
    employee: string;
    hours: number;
    construction: string;
    budgetItem: string;
    workOnConstruction: boolean;
    employeeId: number;
    constructionId: number;
    budgetItemId: number;
}