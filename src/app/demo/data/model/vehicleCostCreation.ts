export interface VehicleCostCreation {
    vehicleId: number;
    constructionId: number;
    date: Date;
    isTravelToConstruction: boolean;
    destinations: number[];
}