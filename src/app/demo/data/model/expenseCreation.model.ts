import { DocumentType } from "../enum/documentType";
import { PaymentMethod } from "../enum/paymentMethod";
import { SubCategoryType } from "../enum/subCategoryType";
import { ArticleCreation } from "./articleCreation.model";
import { ExternalServiceCreation } from "./externalServiceCreation.model";

export interface ExpenseCreation {
    date: Date;
    subCategoryType: SubCategoryType;
    originId: number;
    documentType: DocumentType;
    documentNumber: string;
    paymentDeadline: Date;
    value: number;
    iva: number;
    isIntegralPayment: boolean;
    paymentValue: number;
    accountId: number;
    paymentMethod: PaymentMethod;
    externalServiceList: ExternalServiceCreation[];
    articleList: ArticleCreation[];
}
