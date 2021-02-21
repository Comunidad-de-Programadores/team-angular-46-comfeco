export interface JwtPayload {
    user: string;
    email: string;
    type: string;
    iat?: number
}