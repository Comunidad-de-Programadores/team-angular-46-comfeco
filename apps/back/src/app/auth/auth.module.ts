import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { JwtStrategy } from '../../config/guard/jwt.strategy';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { Configuracion } from '../../config/config.keys';
import { CorreoModule } from '../../config/correo/correo.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { BasicoController } from './basico/basico.controller';
import { BasicoService } from './basico/basico.service';
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
            secret: config.get(Configuracion.JWT_SECRETO),
            signOptions: {
                expiresIn: config.get(Configuracion.JWT_TIEMPO_EXPIRACION)
            }
        };
    }
});

@Module({
    controllers: [
        BasicoController,
        GoogleController,
        FacebookController],
    providers: [
        JwtStrategy,
        ConfigService,
        BasicoService,
        GoogleService, GoogleStrategy,
        FacebookService, FacebookStrategy,
        AuthService
    ],
    imports: [
        passportModule,
        jwtModule,
        HttpModule,
        CorreoModule,
        UsuarioModule
    ],
    exports: [
        JwtStrategy,
        PassportModule
    ]
})
export class AuthModule {}
