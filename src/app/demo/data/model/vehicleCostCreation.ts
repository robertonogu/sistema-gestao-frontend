import { Destination } from './destination.model';

export interface VehicleCostCreation {
    vehicleId: number;
    constructionId: number;
    date: Date;
    destinations: Destination[];
}