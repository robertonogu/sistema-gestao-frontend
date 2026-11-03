export enum AbsenceType {
    VACATION = "Férias", 
    JUSTIFIED_ABSENCE = "Falta Justificada", 
    UNJUSTIFIED_ABSENCE = "Falta Injustificada",
    SICK_LEAVE = "Baixa Médica",
    UNPAID_LEAVE = "Licença sem Vencimento",
    BEREAVEMENT = "Morte de Familiar",
    MARRIAGE = "Matrimónio",
    CHILDBIRTH = "Parto",
    WORK_ACCIDENT = "Acidente de Trabalho"
}

const TYPES_WITHOUT_HOURS = ['SICK_LEAVE', 'UNPAID_LEAVE', 'BEREAVEMENT', 'MARRIAGE', 'CHILDBIRTH'];

export function absenceTypeAllowsHours(type: string | null | undefined): boolean {
    return !type || !TYPES_WITHOUT_HOURS.includes(type);
}
