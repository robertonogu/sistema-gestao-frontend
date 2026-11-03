import { DestinationType } from '../data/model/destination.model';

export interface DestinationLocation {
    type: DestinationType;
    ownerId: number;
    ownerName: string;
    locationId: number;
    locationName: string;
}
