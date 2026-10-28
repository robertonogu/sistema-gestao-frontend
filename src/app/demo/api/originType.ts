// Tipo de uma origem (ver OriginType no backend): distingue origens com o mesmo nome,
// p.ex. a mesma pessoa como funcionária, credora e financiadora
export type OriginType = 'EMPLOYEE' | 'SUPPLIER' | 'FINANCER' | 'CREDITOR' | 'CLIENT' | 'EXTERNAL_ENTITY';

// Duas letras (sem repetições) e o nome do tipo, para a bola antes do nome da origem
export const ORIGIN_TYPES: Record<OriginType, { short: string, label: string }> = {
    EMPLOYEE: { short: 'Fu', label: 'Funcionário' },
    SUPPLIER: { short: 'Fo', label: 'Fornecedor' },
    FINANCER: { short: 'Fi', label: 'Financiador' },
    CREDITOR: { short: 'Cr', label: 'Credor' },
    CLIENT: { short: 'Cl', label: 'Cliente' },
    EXTERNAL_ENTITY: { short: 'EE', label: 'Entidade externa' }
};

// Títulos das linhas de grupo (Saldos, Débitos) e a ordem dos grupos
export const ORIGIN_GROUP_LABELS: Record<OriginType, string> = {
    EMPLOYEE: 'Pessoal',
    CREDITOR: 'Credores',
    FINANCER: 'Financiadores',
    SUPPLIER: 'Fornecedores',
    CLIENT: 'Clientes',
    EXTERNAL_ENTITY: 'Entidades externas'
};

export const ORIGIN_GROUP_ORDER: OriginType[] = ['EMPLOYEE', 'CREDITOR', 'FINANCER', 'SUPPLIER', 'CLIENT', 'EXTERNAL_ENTITY'];

export function originGroupLabel(type: OriginType | null | undefined): string {
    return type ? ORIGIN_GROUP_LABELS[type] : 'Outros';
}

// Origem num filtro: como ItemName (id, name) mais o tipo
export interface OriginName {
    id: number;
    name: string;
    type: OriginType | null;
}
