import { TokenCookieDto } from "./tokenCookieDto";

export class TokenResponseDto {
    readonly accessToken: TokenCookieDto;
    readonly refreshToken: TokenCookieDto;
    readonly user: string;
}