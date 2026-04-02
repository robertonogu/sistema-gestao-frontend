import { ArticleFamily } from "../data/enum/articleFamily";
import { Unit } from "../data/enum/unit";

export interface IssuedArticle {
    code: string;
    date: Date;
    documentNumber: string;
    supplier: string;
    family: ArticleFamily
    name: string;
    quantity: number;
    unit: Unit;
    unitValue: number;
    totalValue: number;
    construction: string;
}