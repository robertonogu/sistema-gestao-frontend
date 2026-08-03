import { ToolStatus } from "../enum/toolStatus";

export interface ToolCreation {
    code: string;
    name: string;
    brand: string;
    model: string;
    purchaseDate: Date;
    purchaseValue: number;
    location: string;
    status: ToolStatus;
}
