import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { AccountType, GenericResponse, TokenDto } from '@comfeco/interfaces';

import { JwtPayload } from '../../config/guard/jwt_payload.interface';
import { ConfigService } from '../../config/config.service';
import { Configuration } from '../../config/config.keys';
import { TokenCookieDto } from './tokenCookieDto';
import { TokenResponseDto } from './tokensResponse';
import { CookieGuard } from '../../config/guard/cookie.enum';

@Injectable()
export class AuthService {

    OPTIONS_COOKIES:string = 'HttpOnly; Path=/;';
    SET_COOKIES:string = 'Set-Cookie';

    constructor(
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService
    ){}

    setCookies(response:Response, tokens:TokenResponseDto, code:HttpStatus): void {
        const { accessToken, refreshToken } = tokens;
        
        const resp:TokenDto = {
            user: tokens.user,
            code
        };

        response.setHeader(this.SET_COOKIES, [accessToken.cookie, refreshToken.cookie]);
        response.send(resp);
    }

    cleanCookies(response:Response, message:string): void {
        const resp:GenericResponse = {
            code: HttpStatus.OK,
            message
        };
        const epires:string = 'Max-Age=0';

        response.setHeader(this.SET_COOKIES, [
            `${CookieGuard.AUTHENTICATION}=; ${this.OPTIONS_COOKIES} ${epires}`,
            `${CookieGuard.REFRESH}=; ${this.OPTIONS_COOKIES} ${epires}`
        ]);

        response.send(resp);
    }

    createAccessToken(id:string, type:AccountType): TokenCookieDto {
        const expiresIn:number = parseInt(this._configService.get(Configuration.JWT_ACCESS_TOKEN_EXPIRATION_TIME));

        const payload:JwtPayload = {
            id,
            type,
            iat: Date.now(),
        };
        
        const token = this._jwtService.sign( payload, {
            secret: this._configService.get(Configuration.JWT_TOKEN_SECRET),
            expiresIn: expiresIn
         });

        const cookie:string = this._formatCookie(CookieGuard.AUTHENTICATION, expiresIn, token);

        return { token, cookie };
    }

    createRefreshToken(id:string, type:AccountType): TokenCookieDto {
        const expiresIn:number = parseInt(this._configService.get(Configuration.JWT_REFRESH_TOKEN_EXPIRATION_TIME));
        
        const payload:JwtPayload = {
            id,
            type,
            iat: Date.now(),
        };
        
        const token = this._jwtService.sign( payload, {
            secret: this._configService.get(Configuration.JWT_TOKEN_SECRET),
            expiresIn: expiresIn
        });

        const cookie:string = this._formatCookie(CookieGuard.REFRESH, expiresIn, token);
        
        return { token, cookie };
    }

    private _formatCookie(type:string, expiresIn:number, token:string): string {
        return `${type}=${token}; ${this.optionsCookie(expiresIn)}`;
    }

    optionsCookie(expiresIn:number) {
        const dateNow:number = Date.now();
        const dateExpires:string = new Date(dateNow+expiresIn).toUTCString();

        return `${this.OPTIONS_COOKIES} expires=${dateExpires}`;
    }
    
}
