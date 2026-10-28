import { OriginType } from "./originType";

export interface ExpenseInDebt {
    id: number;
    date?: Date;
    paymentDeadline?: Date;
    originId: number;
    origin: string;
    // Para a bola Fu/Cr/Fi… nos Débitos (não vem nas linhas de um pagamento a editar)
    originType?: OriginType | null;
    documentNumber: string;
    debtValue: number;
    totalValue: number;
}