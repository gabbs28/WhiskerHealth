import { toTitleCase } from './string.ts';

//correcting enum value format, prisma replaced my spaces with _ and I'm switching it back
export const formatEnumeration = <T extends string>(
    enumeration: { [key: string]: T },
    value: T,
): string => {
    return toTitleCase(enumeration[value].replace(/_/g, ' '));
};
