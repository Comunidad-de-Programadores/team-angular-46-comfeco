import { HttpException, HttpStatus } from '@nestjs/common';

import { GenericResponse } from '@comfeco/interfaces';

export class ParametersExcepcion extends HttpException {
    
    responseSolution: GenericResponse;

    constructor(responseSolution: GenericResponse) {
        super('Bad Request', HttpStatus.BAD_REQUEST);
        this.responseSolution = responseSolution;
    }

}