import { EquipmentCategory } from "../data/enum/equipmentCategory";
import { EquipmentStatus } from "../data/enum/equipmentStatus";

export interface Equipment {
    equipmentId: number;
    code: string;
    name: string;
    brand: string;
    model: string;
    serialNumber: string;
    purchaseDate: Date;
    purchaseValue: number;
    warrantyStart: Date;
    warrantyEnd: Date;
    power: string;
    purchaseDocumentUrl?: string;
    status: EquipmentStatus;
    category: EquipmentCategory;
}

export interface EquipmentImage {
    equipmentImageId: number;
    equipmentId: number;
    url: string;
}
