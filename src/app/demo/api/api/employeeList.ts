import { Employee } from "../employee";

export interface EmployeeList {
    employeeList: Employee[],
    totalElements: number,
    totalPages: number
}