import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountType, TokenDto } from '@comfeco/interfaces';

import { JwtPayload } from '../../config/guard/jwt_payload.interface';

@Injectable()
export class AuthService {

    constructor(private readonly _jwtService: JwtService){}

    createAccessToken(user:string, email:string, type:AccountType, code:number) {
        const payload:JwtPayload = {
            user,
            email,
            type,
            iat: Date.now(),
        };
        
        const token = this._jwtService.sign( payload );

        return { token, code, user } as TokenDto;
    }
    
}
