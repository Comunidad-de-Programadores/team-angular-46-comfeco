import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { FirebaseDataBase } from './config/db/firebase.db';
import { helmetConfig } from './config/helmet/helmet.config';
import { HttpInterceptor } from './config/interceptor/request.interceptor';
import { SwaggerConfiguracion } from './config/swagger/swagger.config';
import { ValidateServicePipe, filtersGlobal } from './util/index';

(async () => {
    const app = await NestFactory.create(
        AppModule, {
            logger: ['log', 'error', 'warn', 'debug'],
        }
    );
    
    app.setGlobalPrefix(environment.prefix_api);
    app.useGlobalPipes(new ValidateServicePipe());
    app.useGlobalFilters(...filtersGlobal);
    app.useGlobalInterceptors(new HttpInterceptor());
    app.enableCors();
    helmetConfig(app);
    
    new SwaggerConfiguracion().publish(app);
    new FirebaseDataBase().connect();
    
    await app.listen(AppModule.port);
})();