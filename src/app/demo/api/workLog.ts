import { LocalType } from "../data/enum/localType";

export interface WorkLog {
    date: Date;
    employee: string;
    hours: number;
    construction: string;
    budgetItem: string;
    workOnConstruction: boolean;
}