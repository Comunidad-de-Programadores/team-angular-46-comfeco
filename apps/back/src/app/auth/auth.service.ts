import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenDto } from '@comfeco/interfaces';

import { JwtPayload } from '../../config/guard/jwt_payload.interface';

@Injectable()
export class AuthService {

    constructor(private readonly _jwtService: JwtService){}

    createAccessToken(user:string, email:string, code:number) {
        const payload:JwtPayload = {
            user,
            email,
            iat: Date.now(),
        };
        
        const token = this._jwtService.sign( payload );

        return { token, code, user } as TokenDto;
    }
    
}
