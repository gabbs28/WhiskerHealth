import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

//takes a date and returns a string

export function dateConverter(date: Date): string {
    return formatInTimeZone(date, 'UTC', 'MM/dd/yyyy');
}

export function datetimeConverter(date: Date): string {
    return format(date, 'MM/dd/yyyy hh:mm:ss a');
}
