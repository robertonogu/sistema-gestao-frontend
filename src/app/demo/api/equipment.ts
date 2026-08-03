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
    status: EquipmentStatus;
}
