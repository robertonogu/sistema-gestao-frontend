export type WorkLogSubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface WorkLogSubmission {
    workLogSubmissionId: number;
    employeeId: number;
    employeeName: string;
    date: string;
    hours: number;
    workOnConstruction: boolean;
    constructionId: number;
    constructionName: string;
    budgetItemId: number;
    budgetItemName: string;
    description: string | null;
    status: WorkLogSubmissionStatus;
    rejectionReason: string | null;
    workLogId: number | null;
    createdAt: string;
    reviewedAt: string | null;
}

export interface WorkLogSubmissionInput {
    date: Date;
    hours: number;
    workOnConstruction: boolean;
    constructionId: number;
    budgetItemId: number;
    description: string | null;
}
