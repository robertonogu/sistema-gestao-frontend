import { CategoryCost } from "./categoryCost";

export interface DashboardData {
    revenuesValue: number;
    expensesValue: number;
    debtsValue: number;
    balance: number;
    revenuesPerMonth: number[];
    expensesPerMonth: number[];
    categoryCosts: CategoryCost[];
}