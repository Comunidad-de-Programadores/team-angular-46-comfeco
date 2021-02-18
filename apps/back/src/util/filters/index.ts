import { ExceptionFilter } from '@nestjs/common';

import { InternalErrorFilter } from './internal_error.filter';
import { UnauthorizedFilter } from './unauthorized.filter';
import { ParametersFilter } from './parameters_error.filter';

export const filtersGlobal:ExceptionFilter[] = [
    new ParametersFilter(),
    new UnauthorizedFilter(),
    new InternalErrorFilter()
];