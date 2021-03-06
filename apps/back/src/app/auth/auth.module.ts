import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AccessTokenStrategy } from '../../config/guard/access_token.strategy';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { Configuration } from '../../config/config.keys';
import { EmailModule } from '../../config/email/email.module';
import { BasicController } from './basic/basic.controller';
import { BasicService } from './basic/basic.service';
import { GoogleController } from './google/google.controller';
import { GoogleService } from './google/google.service';
import { FacebookController } from './facebook/facebook.controller';
import { FacebookService } from './facebook/facebook.service';
import { RefreshTokenStrategy } from '../../config/guard/refresh_token.strategy';
import { InnerModule } from '../inner/inner.module';

const passportModule: DynamicModule = PassportModule.register({
    defaultStrategy: 'jwt'
});

const jwtModule: DynamicModule = JwtModule.registerAsync({
    imports: [ ConfigModule ],
    inject: [ ConfigService ],
    useFactory(config: ConfigService) {
        return {
            secret: config.get(Configuration.JWT_TOKEN_SECRET),
            signOptions: {
                algorithm: "HS256"
            }
        };
    }
});

@Module({
    controllers: [
        BasicController,
        GoogleController,
        FacebookController
    ],
    providers: [
        RefreshTokenStrategy,
        AccessTokenStrategy,
        ConfigService,
        BasicService,
        GoogleService,
        FacebookService,
        AuthService,
    ],
    imports: [
        passportModule,
        jwtModule,
        HttpModule,
        EmailModule,
        InnerModule,
    ],
    exports: [
        RefreshTokenStrategy,
        AccessTokenStrategy,
        PassportModule,
        JwtModule,
        jwtModule
    ]
})
export class AuthModule {}
