// Company data found on nif.pt for a NIF
export interface NifLookup {
    found: boolean;
    nif: number;
    name: string | null;
    address: string | null;
    postalCode: string | null;
    city: string | null;
}
