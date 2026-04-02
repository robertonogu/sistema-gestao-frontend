import { CategoryType } from "../data/enum/categoryType";

export interface CategoryCost {
    categoryType: CategoryType;
    value: number;
}