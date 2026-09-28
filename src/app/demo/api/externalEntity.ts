export interface ExternalEntity {
    originId: number;
    name: string;
    nif: number;
    initialBalance?: number | null;
}