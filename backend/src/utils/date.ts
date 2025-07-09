import { format } from 'date-fns';

export function dateConverter(date: Date): string {
    return format(date, 'MM/dd/yyyy');
}
