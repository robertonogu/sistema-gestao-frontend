export interface ArticleStock {
    articleId: number;
    code: string;
    name: string;
    unit: string;
    quantity: number;
    unitValue: number;
    totalValue: number;
    documentNumber: string | null;
    originId: number | null;
    origin: string | null;
}
