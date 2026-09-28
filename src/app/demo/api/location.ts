// A named place (e.g. a store's locality) of a supplier or construction; the first one is the main location
export interface Location {
    locationId?: number;
    name: string;
    address: string;
    placeId: string;
}
