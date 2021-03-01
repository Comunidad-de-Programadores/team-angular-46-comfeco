import { ExceptionFilter, HttpStatus, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

import { GenericResponse } from '@comfeco/interfaces';

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {

    catch(responseError:UnauthorizedException, host:ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const status = responseError.getStatus();

        const error: GenericResponse = {
            code: HttpStatus.UNAUTHORIZED,
            errors: ['Usuario no autenticado']
        };

        response
            .status(status)
            .json(error);
    }
    
}