import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

import { ConfigService } from '../config.service';
import { Configuration } from '../config.keys';
import { JwtUtil } from '../../util/jwt/jwt.util';
import { CookieGuard } from './cookie.enum';

@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh-token') {
    private readonly logger = new Logger(RefreshGuard.name);

    constructor(
        private readonly _configService: ConfigService
    ) {
        super();
    }
    
    async canActivate(
        context: ExecutionContext,
      ):Promise<any> {
        const request = context.getArgByIndex(0);
        const secret:string = this._configService.get(Configuration.JWT_TOKEN_SECRET);
        const token:string = JwtUtil.getTokenCookie(request, CookieGuard.REFRESH);
        JwtUtil.checkTokenExpiration(token, secret);
        
        return super.canActivate(context);
    }

    handleRequest(err:any, user:any, info: Error) {
        if (err || !user || info instanceof TokenExpiredError) {
            this.logger.error('Refresh Token expired');
            throw new UnauthorizedException();
        }

        return user;
    }

}