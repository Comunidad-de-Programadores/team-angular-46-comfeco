import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

import { environment } from '../../../environments/environment';
import { ConfigService } from '../../../config/config.service';
import { Configuracion } from '../../../config/config.keys';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(private readonly _configService: ConfigService) {
        super({
            clientID: _configService.get(Configuracion.GOOGLE_CLIENT_ID),
            clientSecret: _configService.get(Configuracion.GOOGLE_SECRET),
            callbackURL: environment.produccion
                            ? _configService.get(Configuracion.DOMAIN)
                            : _configService.get(Configuracion.LOCAL)+_configService.get(Configuracion.PORT)
                            + `/${environment.prefijo_api}/auth/google/respuesta`,
            scope: ['email', 'profile'],
        });
    }

    async validate (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile
        const usuario = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null, usuario);
    }
    
}