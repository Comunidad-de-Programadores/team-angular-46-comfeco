import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenDto } from '@comfeco/interfaces';

import { JwtPayload } from '../../config/guard/jwt_payload.interface';

@Injectable()
export class AuthService {

    constructor(private readonly _jwtService: JwtService){}

    crearTokenAcceso(usuario:string, correo:string, codigo:number) {
        const payload:JwtPayload = {
            usuario,
            correo,
            iat: Date.now(),
        };
        
        const token = this._jwtService.sign( payload );

        return { token, codigo, usuario } as TokenDto;
    }
    
}
