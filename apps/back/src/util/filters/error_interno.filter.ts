import { RespuestaGenerica } from '@comfeco/interfaces';
import { ExceptionFilter, Catch, ArgumentsHost, InternalServerErrorException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(InternalServerErrorException)
export class ErrorInternoFilter implements ExceptionFilter {
    private readonly logger = new Logger(ErrorInternoFilter.name);

    catch(errorProducido:InternalServerErrorException, host:ArgumentsHost) {
        this.logger.error(JSON.stringify(errorProducido));
        const contexto = host.switchToHttp();
        const respuesta = contexto.getResponse<Response>();
        const estatus = errorProducido.getStatus();
        const error:RespuestaGenerica = {
            codigo: estatus,
            errores: [ 'Se produjo un error favor de reportarlo' ]
        };

        respuesta
            .status(estatus)
            .json(error);
    }
    
}