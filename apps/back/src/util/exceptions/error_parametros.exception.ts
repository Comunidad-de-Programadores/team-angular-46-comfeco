import { HttpException, HttpStatus } from '@nestjs/common';

import { RespuestaGenerica } from '@comfeco/interfaces';

export class ParametrosExcepcion extends HttpException {
    
    respuesta: RespuestaGenerica;

    constructor(respuesta: RespuestaGenerica) {
        super('Bad Request', HttpStatus.BAD_REQUEST);
        this.respuesta = respuesta;
    }

}