import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

import { environment } from './../../environments/environment';

export class SwaggerConfiguracion {

    publicar(app:INestApplication): void {
        const configuracion = new DocumentBuilder()
            .setDescription(environment.descripcion)
            .setTitle(environment.nombre_app)
            .setVersion(environment.version_app)
            .addBearerAuth( 
                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
                'access-token-service', 
            )
            .build();
        
        const opciones:SwaggerDocumentOptions =  {
            operationIdFactory: (
                controllerKey: string,
                methodKey: string
            ) => methodKey
        };

        const documento = SwaggerModule.createDocument(app, configuracion, opciones);

        SwaggerModule.setup(environment.prefijo_api_doc, app, documento,{
            customSiteTitle: environment.titulo,
        });
    }
    
}