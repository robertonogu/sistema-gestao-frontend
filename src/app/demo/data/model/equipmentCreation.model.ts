import { EquipmentStatus } from "../enum/equipmentStatus";

export interface EquipmentCreation {
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
    status: EquipmentStatus;
}
