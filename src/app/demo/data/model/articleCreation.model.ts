import { ArticleFamily } from "../enum/articleFamily";
import { Unit } from "../enum/unit";

export interface ArticleCreation {
    articleFamily: ArticleFamily;
    name: string;
    quantity: number;
    unit: Unit;
    unitValue: number;
}