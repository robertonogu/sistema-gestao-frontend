export interface ConstructionCalendarEvent {
    day: number;
    type: 'invoice' | 'payment';
    value: number;
    description: string;
    status: string;
}
