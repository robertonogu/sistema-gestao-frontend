import { EmployeeStatus } from "../data/enum/employeeStatus";

export interface Employee {
    originId: number,
    name: string,
    nif: number,
    baseSalary: number,
    allowance: number,
    foodAllowance: number,
    healthInsurance: number,
    internal: boolean,
    statusEmployee: EmployeeStatus
}
