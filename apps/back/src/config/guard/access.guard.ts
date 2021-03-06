import { ExecutionContext, Injectable, Logger, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from 'jsonwebtoken';

import { ConfigService } from '../config.service';
import { Configuration } from '../config.keys';
import { JwtUtil } from '../../util/jwt/jwt.util';
import { CookieGuard } from './cookie.enum';

export const ALLOW_ANONYMOUS_META_KEY = 'allowAnonymous';
export const AllowAnonymous = () => SetMetadata(ALLOW_ANONYMOUS_META_KEY, true);

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(AccessGuard.name);

    constructor(
        private readonly _configService: ConfigService,
        private readonly reflector: Reflector,
    ) {
        super();
    }
    
    async canActivate(
        context: ExecutionContext,
      ):Promise<any> {
        const isAnonymousAllowed = this.reflector.get<boolean>(
            ALLOW_ANONYMOUS_META_KEY,
            context.getHandler(),
        ) || this.reflector.get<boolean>(ALLOW_ANONYMOUS_META_KEY, context.getClass());
        if (isAnonymousAllowed) {
            return true;
        }
        
        const request = context.getArgByIndex(0);
        const secret:string = this._configService.get(Configuration.JWT_TOKEN_SECRET);
        const token:string = JwtUtil.getTokenCookie(request, CookieGuard.AUTHENTICATION);
        JwtUtil.checkTokenExpiration(token, secret);
        
        return super.canActivate(context);
    }

    handleRequest(err:any, user:any, info: Error) {
        if (err || !user || info instanceof TokenExpiredError) {
            this.logger.error('Access Token expired');
            throw new UnauthorizedException();
        }

        return user;
    }

}