// Login e utilizadores (ver AuthController / UserController no backend)
export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface Session {
    token: string;
    expiresAt: string;
    userId: number;
    username: string;
    name: string;
    role: UserRole;
    employeeId: number | null;
}

export interface User {
    userId: number;
    username: string;
    name: string;
    role: UserRole;
    employeeId: number | null;
    employeeName: string | null;
    active: boolean;
    createdAt: string;
}

export interface UserCreation {
    username: string;
    password: string;
    role: UserRole;
    employeeId: number | null;
}
