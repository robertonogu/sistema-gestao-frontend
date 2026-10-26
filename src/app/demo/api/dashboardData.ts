import { CategoryCost } from "./categoryCost";
import { ExpenseInDebt } from "./expenseInDebt";

export interface DashboardData {
    revenuesValue: number;
    expensesValue: number;
    debtsValue: number;
    balance: number;
    // O que a empresa deve aos financiadores
    financingDebt?: number;
    revenuesPerMonth: number[];
    expensesPerMonth: number[];
    categoryCosts: CategoryCost[];
    expensesInDebt: ExpenseInDebt[];
    invoicedValue: number;
    previousYearExpensesValue: number;
    overdueDebtsCount: number;
}