export function dateToString(date: Date): string {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('.');
}

export function timeToString(date: Date): string {
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    return [hh, mm].join(':');
}

export function getAuditoriumUrlFromStreamUrl(streamUrl: string): string {
    const url = new URL(streamUrl);
    url.pathname = url.pathname.replace('/', '/app/stream/auditoriums/');
    return url.toString();
}