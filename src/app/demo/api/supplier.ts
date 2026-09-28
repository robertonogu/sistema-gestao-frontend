import { Location } from './location';

export interface Supplier {
    originId: number;
    name: string;
    nif: number;
    address: string;
    placeId: string;
    locations?: Location[];
    initialBalance?: number | null;
}