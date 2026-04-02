import { Expense } from "../expense";

export interface ExpenseList {
    expenseList: Expense[],
    totalElements: number,
    totalPages: number
}