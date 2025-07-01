export interface ErrorResponse {
    error: boolean;
    title: string;
    status: number;
    errors: Record<string, string>;
}
