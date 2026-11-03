
export function toDecimalHours(hours: number, minutes: number): number {
    return Math.round((hours + minutes / 60) * 100) / 100;
}

export function fromDecimalHours(value: number): { hours: number, minutes: number } {
    let hours = Math.floor(value);
    let minutes = Math.round((value - hours) * 60);
    if (minutes === 60) {
        hours++;
        minutes = 0;
    }
    return { hours, minutes };
}

export function formatHours(value: number): string {
    const { hours, minutes } = fromDecimalHours(value);
    if (!minutes) return `${hours} h`;
    return hours ? `${hours} h ${minutes} min` : `${minutes} min`;
}
