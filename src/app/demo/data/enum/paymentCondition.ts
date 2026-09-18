export enum PaymentCondition {
    IMMEDIATE = "Pronto Pagamento",
    DAYS_30 = "30 dias",
    DAYS_60 = "60 dias",
    DAYS_90 = "90 dias",
    DAYS_120 = "120 dias",
    DAYS_150 = "150 dias",
    DAYS_180 = "180 dias",
    OTHER = "Outra"
}

export const PAYMENT_CONDITION_DAYS: Record<string, number> = {
    IMMEDIATE: 0,
    DAYS_30: 30,
    DAYS_60: 60,
    DAYS_90: 90,
    DAYS_120: 120,
    DAYS_150: 150,
    DAYS_180: 180
};
