import { Unit } from "../data/enum/unit";

export interface Item {
    name: string;
    quantity: number;
    unit: Unit;
    unitValue: number;
    iva: number;
    totalValue: number;
}
