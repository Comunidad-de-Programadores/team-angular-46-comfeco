export class GenericResponse {
    readonly success?: boolean;
    readonly code: number;
    readonly message?: string;
    readonly errors?: any[];
}