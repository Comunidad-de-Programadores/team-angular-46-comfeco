import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

import { AccountType } from '@comfeco/interfaces';

@Injectable()
export class JwtUtil {
    private static readonly logger = new Logger(JwtUtil.name);

    static getTokenCookie(request:any, cookieKey:string) {
        const cookie:string = request?.headers?.cookie;
        let token:string;

        if(cookie && cookie.indexOf(cookieKey)>-1) {
            const segments:string[] = cookie.split(' ');
            for(const segment of segments) {
                if(segment.indexOf(cookieKey)>-1) {
                    const element:number = segment.substring(segment.length-1)===';' ? segment.length-1 : segment.length;
                    token = segment.substring(cookieKey.length+1, element);
                }
            }
        }

        return token;
    }

    static checkTokenExpiration(token:any, secret:string): void {
        try {
            if(!token) throw new UnauthorizedException();
            const payload:any = jwt.verify(token, secret);
            if(Date.now()>payload.exp) throw new UnauthorizedException();
        } catch(err) {
            throw new UnauthorizedException();
        }
    }

    static tokenType(token:string, secret:string): AccountType {
        let typePayload:string;

        try {
            if(!token) throw new UnauthorizedException();
            const payload:any = jwt.verify(token, secret);
            typePayload = payload.type;
        } catch(err) {
            this.logger.debug(err.message);
        }

        return Object.values(AccountType).filter(value => value===typePayload)[0];
    }

}