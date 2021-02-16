import { ExceptionFilter, HttpStatus, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

import { RespuestaGenerica } from '@comfeco/interfaces';

@Catch(UnauthorizedException)
export class NoAutorizadoFilter implements ExceptionFilter {

    catch(respuestaError:UnauthorizedException, host:ArgumentsHost) {
        const contexto = host.switchToHttp();
        const respuesta = contexto.getResponse<Response>();
        const estatus = respuestaError.getStatus();

        const error: RespuestaGenerica = {
            codigo: HttpStatus.UNAUTHORIZED,
            mensaje: 'Usuario no autenticado'
        };

        respuesta
            .status(estatus)
            .json(error);
    }
    
}