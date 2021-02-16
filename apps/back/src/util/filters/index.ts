import { ExceptionFilter } from '@nestjs/common';
import { ErrorInternoFilter } from './error_interno.filter';

import { NoAutorizadoFilter } from './sin_autorizacion.filter';
import { ParametrosFilter } from './parametros_error.filter';

export const filtrosGlobalesError:ExceptionFilter[] = [
    new ParametrosFilter(),
    new NoAutorizadoFilter(),
    new ErrorInternoFilter()
];