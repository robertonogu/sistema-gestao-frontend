import { CategoryCost } from "./categoryCost";
import { ExpenseInDebt } from "./expenseInDebt";

export interface DashboardData {
    revenuesValue: number;
    expensesValue: number;
    debtsValue: number;
    balance: number;
    // Parte do saldo nas contas de caixa e nas contas bancárias
    cashBalance?: number;
    bankBalance?: number;
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