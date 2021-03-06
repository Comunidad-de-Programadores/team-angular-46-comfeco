import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';

import { GenericResponse, Status } from "@comfeco/interfaces";
import { ValidatorService } from "@comfeco/validator";

import { ConfigService } from "../config.service";
import { Configuration } from "../config.keys";
import { JwtPayload } from "./jwt_payload.interface";
import { UserRepository } from "../../app/inner/user/user.repository";
import { JwtUtil } from "../../util/jwt/jwt.util";
import { CookieGuard } from "./cookie.enum";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    
    constructor(
        private readonly _configService: ConfigService,
        private readonly _userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors(
                [(request: Request) => JwtUtil.getTokenCookie(request, CookieGuard.AUTHENTICATION)]
            ),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: _configService.get(Configuration.JWT_TOKEN_SECRET)
        });
    }

    async validate(request: Request, payload:JwtPayload) {
        const accessToken:string = JwtUtil.getTokenCookie(request, CookieGuard.AUTHENTICATION);
        let validation:GenericResponse;
        const { id } = payload;
        
        if(ValidatorService.id(id, validation)!=null) {
            throw new UnauthorizedException();
        }
        
        const baseUser = await this._userRepository.idExists(id);
        
        if(baseUser==null || !baseUser || baseUser.status!=Status.ACTIVE || baseUser.tokenApi==='') {
            throw new UnauthorizedException();
        }

        const validAccessToken:boolean = accessToken===baseUser.tokenApi;

        if(!validAccessToken) {
            throw new UnauthorizedException();
        }

        return payload;
    }
    
}