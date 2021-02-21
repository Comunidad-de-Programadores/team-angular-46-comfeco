import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { JwtStrategy } from '../../config/guard/jwt.strategy';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { Configuration } from '../../config/config.keys';
import { EmailModule } from '../../config/email/email.module';
import { UserModule } from '../user/user.module';
import { BasicController } from './basic/basic.controller';
import { BasicService } from './basic/basic.service';
import { GoogleController } from './google/google.controller';
import { GoogleService } from './google/google.service';
import { GoogleStrategy } from './google/google.strategy';
import { FacebookController } from './facebook/facebook.controller';
import { FacebookService } from './facebook/facebook.service';
import { FacebookStrategy } from './facebook/facebook.strategy';

const passportModule: DynamicModule = PassportModule.register({
    defaultStrategy: 'jwt'
});

const jwtModule: DynamicModule = JwtModule.registerAsync({
    imports: [ ConfigModule ],
    inject: [ ConfigService ],
    useFactory(config: ConfigService) {
        return {
            secret: config.get(Configuration.JWT_SECRET),
            signOptions: {
                expiresIn: config.get(Configuration.JWT_TIME_EXPIRATION)
            }
        };
    }
});

@Module({
    controllers: [
        BasicController,
        GoogleController,
        FacebookController],
    providers: [
        JwtStrategy,
        ConfigService,
        BasicService,
        GoogleService, GoogleStrategy,
        FacebookService, FacebookStrategy,
        AuthService
    ],
    imports: [
        passportModule,
        jwtModule,
        HttpModule,
        EmailModule,
        UserModule
    ],
    exports: [
        JwtStrategy,
        PassportModule
    ]
})
export class AuthModule {}
