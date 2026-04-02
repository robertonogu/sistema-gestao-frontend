import { InsurancePeriodicity } from "../enum/insurancePeriodicity";
import { VehicleType } from "../enum/vehicleType";

export interface VehicleCreation {
    vehicleType: VehicleType;
    registration: string;
    registrationDate: Date;
    inspectionDate: Date;
    insuranceDate: Date;
    insurancePeriodicity: InsurancePeriodicity;
    valueKilometer: number;
}