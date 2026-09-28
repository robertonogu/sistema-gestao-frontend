import { Location } from '../../api/location';

export interface SupplierCreation {
    name: string;
    nif: number;
    address?: string;
    placeId?: string;
    locations?: Location[];
    initialBalance?: number | null;
}