import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { JwtStrategy } from '../../config/guard/jwt.strategy';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { Configuracion } from '../../config/config.keys';
import { UsuarioModule } from '../usuario/usuario.module';
import { BasicoController } from './basico/basico.controller';
import { BasicoService } from './basico/basico.service';

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
        BasicoController
    ],
    providers: [
        JwtStrategy,
        ConfigService,
        BasicoService,
        AuthService
    ],
    imports: [
        passportModule,
        jwtModule,
        HttpModule,
        UsuarioModule
    ],
    exports: [
        JwtStrategy,
        PassportModule
    ]
})
export class AuthModule {}
