import { SubCategoryType } from "../enum/subCategoryType";
import { Unit } from "../enum/unit";
import { CostAllocationCreation } from "./costAllocationCreation.model";

export interface ItemCreation {
    subCategoryType: SubCategoryType;
    name: string;
    quantity: number;
    unit: Unit;
    netValue: number;
    iva: number;
    totalValue: number;
    costAllocations?: CostAllocationCreation[];
    constructionId?: number;
    vehicleId?: number;
    toolId?: number;
    equipmentId?: number;
    // Return of a stock purchase line (negative quantity); costAllocations are then the quantities coming back from each construction item
    returnedItemId?: number;
}
