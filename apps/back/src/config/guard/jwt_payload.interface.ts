
export interface JwtPayload {
    usuario: string;
    correo: string;
    iat?: number
}