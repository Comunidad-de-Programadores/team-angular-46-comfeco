import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";

import { GenericResponse, Status } from "@comfeco/interfaces";

import { ConfigService } from "../config.service";
import { Configuration } from "../config.keys";
import { JwtPayload } from "./jwt_payload.interface";
import { UserRepository } from "../../app/user/user.repository";
import { ValidatorService } from "@comfeco/validator";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(
        private readonly _configService: ConfigService,
        private readonly _userRepository: UserRepository ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: _configService.get(Configuration.JWT_SECRET)
        });
    }

    async validate(payload:JwtPayload) {
        const { email } = payload;
        let validation:GenericResponse;
        
        if(ValidatorService.email(email, validation)!=null) {
            throw new UnauthorizedException();
        }
        
        const baseUser = await this._userRepository.emailExists(email);
        
        if(baseUser==null || !baseUser || baseUser.status!=Status.ACTIVE || baseUser.tokenApi==='') {
            throw new UnauthorizedException();
        }

        return payload;
    }
    
}