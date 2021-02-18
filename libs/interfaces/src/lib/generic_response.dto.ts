export class GenericResponse {
    readonly code: number;
    readonly message?: string;
    readonly errors?: any[];
}