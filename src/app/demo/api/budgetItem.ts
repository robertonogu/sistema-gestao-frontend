export interface BudgetItem {
    id: number;
    name: string;
    children: BudgetItem[];
}
