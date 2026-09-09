export interface WorkLogDetail {
    date: Date;
    employeeName: string;
    hours: number;
    subItemName: string | null;
}

export interface WorkLogDetailsResponse {
    objectList: WorkLogDetail[];
    totalElements: number;
    totalHours: number;
}
