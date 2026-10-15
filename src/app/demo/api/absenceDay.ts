// One day covered by an absence; hours = 0 means the whole day
export interface AbsenceDay {
    date: string;
    absenceType: string;
    hours: number;
    previousYear: boolean;
}
