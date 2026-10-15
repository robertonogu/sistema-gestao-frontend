import { AbsenceType } from "../data/enum/absenceType";

export interface Absence {
    absenceId: number;
    employee: string;
    employeeId: number;
    absenceType: AbsenceType;
    initialDate: Date;
    finalDate: Date;
    hours: number;
    previousYear: boolean;
}