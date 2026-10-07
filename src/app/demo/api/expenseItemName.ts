// Name of an expense item already used, with the subcategory and unit (enum keys) and VAT rate of its most recent use
export interface ExpenseItemName {
    name: string;
    subCategoryType: string;
    unit: string;
    iva: number;
}
