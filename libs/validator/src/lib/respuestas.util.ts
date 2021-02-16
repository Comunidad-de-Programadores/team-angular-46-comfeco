import { HttpStatus } from "@nestjs/common";

import { RespuestaGenerica } from "@comfeco/interfaces";

export class RespuestaUtil {

    static respuestaGenerica(mensaje:string, errores:string[], codigo:HttpStatus): RespuestaGenerica {
        if(mensaje!='') {
            return {
                codigo,
                mensaje
            };
        } else {
            return {
                codigo,
                errores
            };
        }
    }
    
}