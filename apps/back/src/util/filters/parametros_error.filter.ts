import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';

import { ParametrosExcepcion } from '../exceptions/index';

@Catch(ParametrosExcepcion)
export class ParametrosFilter implements ExceptionFilter {
    private readonly logger = new Logger(ParametrosFilter.name);

    catch(respuestaError:ParametrosExcepcion, host:ArgumentsHost) {
        this.logger.error(JSON.stringify(respuestaError));
        const contexto = host.switchToHttp();
        const respuesta = contexto.getResponse<Response>();
        const estatus = respuestaError.getStatus();
        const { codigo, errores } = respuestaError.respuesta;

        respuesta
            .status(estatus)
            .json({ codigo, errores });
    }
    
}