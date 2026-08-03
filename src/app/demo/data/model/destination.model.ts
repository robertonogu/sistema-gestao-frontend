export type DestinationType = 'SUPPLIER' | 'CONSTRUCTION';

export interface Destination {
    type: DestinationType;
    id: number;
}
