import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { FirebaseDataBase } from './config/db/firebase.db';
import { helmetConfig } from './config/helmet/helmet.config';
import { HttpInterceptor } from './config/interceptor/solicitud.interceptor';
import { SwaggerConfiguracion } from './config/swagger/swagger.config';
import { ValidarServicioPipe, filtrosGlobalesError } from './util/index';

(async () => {
    const app = await NestFactory.create(
        AppModule, {
            logger: ['log', 'error', 'warn', 'debug'],
        }
    );
    
    app.setGlobalPrefix(environment.prefijo_api);
    app.useGlobalPipes(new ValidarServicioPipe());
    app.useGlobalFilters(...filtrosGlobalesError);
    app.useGlobalInterceptors(new HttpInterceptor());
    app.enableCors();
    helmetConfig(app);
    
    new SwaggerConfiguracion().publicar(app);
    new FirebaseDataBase().conectar();
    
    await app.listen(AppModule.puerto);
})();