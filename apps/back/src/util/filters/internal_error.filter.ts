import { ExceptionFilter, Catch, ArgumentsHost, InternalServerErrorException, Logger } from '@nestjs/common';
import { Response } from 'express';

import { GenericResponse } from '@comfeco/interfaces';

@Catch(InternalServerErrorException)
export class InternalErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(InternalErrorFilter.name);

    catch(errorOccurred:InternalServerErrorException, host:ArgumentsHost) {
        this.logger.error(JSON.stringify(errorOccurred));
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const status = errorOccurred.getStatus();

        const error:GenericResponse = {
            code: status,
            errors: [ 'Se produjo un error favor de reportarlo' ]
        };

        response
            .status(status)
            .json(error);
    }
    
}