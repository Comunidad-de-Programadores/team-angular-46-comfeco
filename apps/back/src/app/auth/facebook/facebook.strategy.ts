import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";

import { ConfigService } from '../../../config/config.service';
import { Configuration } from '../../../config/config.keys';
import { environment } from '../../../environments/environment';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    
    constructor(private readonly _configService: ConfigService) {
        super({
            clientID: _configService.get(Configuration.FACEBOOK_ID),
            clientSecret: _configService.get(Configuration.FACEBOOK_SECRET),
            callbackURL: environment.produccion
                            ? _configService.get(Configuration.DOMAIN)
                            : _configService.get(Configuration.LOCAL)+_configService.get(Configuration.PORT)
                            + `/${environment.prefix_api}/auth/facebook/respuesta`,
            scope: "email",
            profileFields: ["emails", "name"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        const { id, name, emails } = profile;
        const userValid = {
            id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            accessToken,
        };
        
        done(null, userValid);
    }
    
}