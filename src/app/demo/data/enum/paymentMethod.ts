export enum PaymentMethod {
    CASH = "Dinheiro", 
    BANK_TRANSFER = "Transferência Bancária", 
    DIRECT_DEBIT = "Débito Direto",
    CREDIT_CARD = "Cartão de Crédito",
    DEBIT_CARD = "Cartão de Débito",
    CHECK = "Cheque",
    PAYMENT_REFERENCE = "Referência de Pagamento",
    ANOTHER = "Outro Meio de Pagamento"
}

export const PAYMENT_METHODS_BY_ACCOUNT_TYPE: Record<'bank' | 'cash', PaymentMethod[]> = {
  cash: [
    PaymentMethod.CASH,
  ],
  bank: [
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.DIRECT_DEBIT,
    PaymentMethod.CREDIT_CARD,
    PaymentMethod.DEBIT_CARD,
    PaymentMethod.CHECK,
    PaymentMethod.PAYMENT_REFERENCE,
    PaymentMethod.ANOTHER,
  ],
};