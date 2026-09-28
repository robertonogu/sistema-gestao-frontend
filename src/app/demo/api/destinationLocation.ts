import { DestinationType } from '../data/model/destination.model';

// A supplier or construction at one of its locations, selectable as a vehicle cost stop
export interface DestinationLocation {
    type: DestinationType;
    ownerId: number;
    ownerName: string;
    locationId: number;
    locationName: string;
}
