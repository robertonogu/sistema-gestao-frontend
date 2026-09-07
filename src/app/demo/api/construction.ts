export interface Construction {
    constructionId: number;
    constructionNumber: string;
    name: string;
    client: string;
    initialBudget: number;
    netValueReceived: number;
    amountToReceive: number;
    favourite: boolean;
    imageUrl?: string;
}