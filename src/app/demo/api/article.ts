import { ArticleFamily } from "../data/enum/articleFamily";
import { Unit } from "../data/enum/unit";

export interface Article {
    articleId: number;
    code: string;
    articleFamily: ArticleFamily;
    entryDate: Date;
    name: string;
    unit: Unit;
    quantity: number;
    unitValue: number;
    totalValue: number;
    // Documento e origem da entrada em stock (vêm do stock à data)
    documentNumber?: string;
    origin?: string;
}