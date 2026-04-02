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
}