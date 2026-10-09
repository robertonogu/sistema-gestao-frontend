import { Revenue } from "./revenue";

export interface RevenueList {
    revenueList: Revenue[],
    totalElements: number,
    totalValue: number,
    totalPages: number
}