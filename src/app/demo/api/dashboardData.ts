import { CategoryCost } from "./categoryCost";
import { ExpenseInDebt } from "./expenseInDebt";

export interface DashboardData {
    revenuesValue: number;
    expensesValue: number;
    debtsValue: number;
    balance: number;
    revenuesPerMonth: number[];
    expensesPerMonth: number[];
    categoryCosts: CategoryCost[];
    expensesInDebt: ExpenseInDebt[];
}