import { MonthlySummary } from "./monthlySummary";
import { TimeMap } from "./timemap";

export interface WorkLogSummary {
    dailySummaries: TimeMap[];
    monthlySummaries: MonthlySummary[];
}
