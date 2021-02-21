import { Injectable, Logger, Req } from '@nestjs/common';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { AccountType } from '@comfeco/interfaces';
import { ConfigService } from '../../config/config.service';
import { Configuration } from '../../config/config.keys';

@Injectable()
export class JwtUtil {
    private readonly logger = new Logger(JwtUtil.name);

    constructor(private _configService: ConfigService) {}
    
    getToken(@Req() req:Request) {
        const headers:any = req.headers;
        return headers.authorization.substring(7);
    }

    accessType(token:string): AccountType {
        let typePayload:string;

        try {
            const payload:any = jwt.verify(token, this._configService.get(Configuration.JWT_SECRET));
            typePayload = payload.type;
        } catch(err) {
            this.logger.debug(err.message);
        }

        return Object.values(AccountType).filter(value => value===typePayload)[0];
    }

}