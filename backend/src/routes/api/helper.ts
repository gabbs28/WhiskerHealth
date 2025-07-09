// Convert a string id into a numerical id
export const toBigIntID = (id: bigint | number | string | undefined | null): bigint => {
    return BigInt(id ?? -1);
};
