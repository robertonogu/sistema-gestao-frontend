import { ToolStatus } from "../data/enum/toolStatus";

export interface Tool {
    toolId: number;
    code: string;
    name: string;
    brand: string;
    model: string;
    purchaseDate: Date;
    purchaseValue: number;
    location: string;
    status: ToolStatus;
}
