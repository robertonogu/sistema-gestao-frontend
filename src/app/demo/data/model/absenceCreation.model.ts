import { AbsenceType } from "../enum/absenceType";

export class AbsenceCreation {
    employeeId: number;
    absenceType: AbsenceType;
    initialDate: Date;
    finalDate: Date;
    hours: number;

    constructor(
        employeeId: number, 
        absenceType: AbsenceType,
        initialDate: Date, 
        finalDate: Date,
        hours: number
    ) {
        this.employeeId = employeeId;
        this.absenceType = absenceType;
        this.initialDate = initialDate;
        this.finalDate = finalDate;
        this.hours = hours;
    }
  
}