// Leitura de uma fatura por fotografia (ver InvoiceCaptureController no backend)
export type InvoiceCaptureStatus = 'WAITING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface InvoiceReadingLine {
    description: string;
    quantity: number;
    unit: string;
    netValue: number;
    ivaRate: number;
    // Chave de SubCategoryType (ex.: PLUMBING) ou null se não houver sugestão
    subCategory: string | null;
}

export interface InvoiceReading {
    qrRead: boolean;
    aiRead: boolean;
    originId: number | null;
    supplierName: string | null;
    supplierNif: number | null;
    documentType: string;
    documentNumber: string | null;
    date: string | null;
    netValue: number | null;
    iva: number | null;
    totalValue: number | null;
    lines: InvoiceReadingLine[];
    warnings: string[];
}

export interface InvoiceCapture {
    token: string;
    status: InvoiceCaptureStatus;
    result: InvoiceReading | null;
    errorMessage: string | null;
}
