import { Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { environment } from '../environments/environment';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { Configuracion } from '../config/config.keys';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
    imports: [
        ConfigModule,
        AuthModule,
        UsuarioModule,
    ],
    providers: [
        ConfigService,
    ]
})
export class AppModule {
    private readonly logger = new Logger(AppModule.name);
    
    public static puerto: number | string;
    
    constructor( private readonly _configService: ConfigService ) {
        AppModule.puerto = this._configService.get( Configuracion.PORT );
        const local:string = _configService.get(Configuracion.LOCAL);
        const dominio:string = _configService.get(Configuracion.DOMAIN);
        const url:string = environment.produccion ? dominio : `${local}${AppModule.puerto}`;
        
        _configService.parametrosServidor(AppModule.puerto, url);

        this.logger.debug(`Servidor listo en el puerto: ${url}`);
        this.logger.debug(`Documentación del api en: ${url}/${environment.prefijo_api_doc}`);
    }
    
}
