import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

import { environment } from './../../environments/environment';

export class SwaggerConfiguracion {

    publish(app:INestApplication): void {
        const configuration = new DocumentBuilder()
            .setDescription(environment.description)
            .setTitle(environment.name_app)
            .setVersion(environment.version_app)
            .addBearerAuth( 
                { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
                'access-token-service', 
            )
            .build();
        
        const options:SwaggerDocumentOptions =  {
            operationIdFactory: (
                controllerKey: string,
                methodKey: string
            ) => methodKey
        };

        const document = SwaggerModule.createDocument(app, configuration, options);

        SwaggerModule.setup(environment.prefix_api_doc, app, document,{
            customSiteTitle: environment.title,
        });
    }
    
}