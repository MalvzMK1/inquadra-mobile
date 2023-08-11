export function formatHour(hourString: string): string {
    const [hour, minute] = hourString.split(':');
    return `${hour}:${minute}`;
}