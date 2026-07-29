import { SubCategoryType } from "../enum/subCategoryType";
import { Unit } from "../enum/unit";
import { CostAllocationCreation } from "./costAllocationCreation.model";

export interface ItemCreation {
    subCategoryType: SubCategoryType;
    name: string;
    quantity: number;
    unit: Unit;
    unitValue: number;
    iva: number;
    totalValue: number;
    costAllocations?: CostAllocationCreation[];
    vehicleId?: number;
}
