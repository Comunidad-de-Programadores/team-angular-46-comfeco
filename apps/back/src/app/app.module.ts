import { Module, Logger } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { environment } from '../environments/environment';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { Configuration } from '../config/config.keys';
import { JwtUtilModule } from '../util/jwt/jwt.module';
import { InnerModule } from './inner/inner.module';

@Module({
    imports: [
        JwtUtilModule,
        ConfigModule,
        AuthModule,
        InnerModule,
    ],
})
export class AppModule {
    private readonly logger = new Logger(AppModule.name);
    
    public static port: number | string;
    
    constructor( private readonly _configService: ConfigService ) {
        AppModule.port = this._configService.get( Configuration.PORT );
        const local:string = _configService.get(Configuration.LOCAL);
        const dominio:string = _configService.get(Configuration.DOMAIN);
        const url:string = environment.produccion ? dominio : `${local}${AppModule.port}`;
        
        _configService.parametersServer(AppModule.port, url);

        this.logger.debug(`Servidor listo en el puerto: ${url}`);
        this.logger.debug(`Documentación del api en: ${url}/${environment.prefix_api_doc}`);
    }
    
}
