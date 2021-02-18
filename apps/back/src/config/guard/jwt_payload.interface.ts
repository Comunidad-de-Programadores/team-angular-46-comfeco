export interface JwtPayload {
    user: string;
    email: string;
    iat?: number
}