import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

import { ParametersExcepcion } from '../exceptions/index';

@Catch(ParametersExcepcion)
export class ParametersFilter implements ExceptionFilter {

    catch(responseError:ParametersExcepcion, host:ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const status = responseError.getStatus();
        const { code, errors } = responseError.responseSolution;

        response
            .status(status)
            .json({ code, errors });
    }
    
}