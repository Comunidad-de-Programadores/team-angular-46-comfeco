import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';

import { GenericResponse, Status } from "@comfeco/interfaces";

import { ConfigService } from "../config.service";
import { Configuration } from "../config.keys";
import { JwtPayload } from "./jwt_payload.interface";
import { UserRepository } from "../../app/inner/user/user.repository";
import { ValidatorService } from "@comfeco/validator";
import { JwtUtil } from "../../util/jwt/jwt.util";
import { CookieGuard } from "./cookie.enum";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    
    constructor(
        private readonly _configService: ConfigService,
        private readonly _userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors(
                [(request: Request) => JwtUtil.getTokenCookie(request, CookieGuard.REFRESH)]
            ),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: _configService.get(Configuration.JWT_TOKEN_SECRET)
        });
    }

    async validate(request: Request, payload:JwtPayload) {
        let validation:GenericResponse;
        const { id } = payload;
        
        if(ValidatorService.id(id, validation)!=null) {
            throw new UnauthorizedException();
        }
        
        const baseUser = await this._userRepository.idExists(id);
        
        if(baseUser==null || !baseUser || baseUser.status!=Status.ACTIVE || baseUser.tokenRefreshApi==='') {
            throw new UnauthorizedException();
        }

        return payload;
    }
    
}