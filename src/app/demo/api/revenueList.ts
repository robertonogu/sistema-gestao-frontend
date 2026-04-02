import { Revenue } from "./revenue";

export interface RevenueList {
    revenueList: Revenue[],
    totalElements: number,
    totalPages: number
}