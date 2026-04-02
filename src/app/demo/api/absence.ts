import { AbsenceType } from "../data/enum/absenceType";

export interface Absence {
    absenceId: number;
    employee: string;
    absenceType: AbsenceType;
    initialDate: Date;
    finalDate: Date;
    hours: number;
}