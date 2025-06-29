export function dateConverter(date: Date): string {
    const currDate = new Date(date);

    return `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`;
}
