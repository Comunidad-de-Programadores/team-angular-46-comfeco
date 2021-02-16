import { RespuestaGenerica } from "@comfeco/interfaces";
import { HttpStatus } from "@nestjs/common";

export class RespuestaUtil {

    static respuestaGenerica(mensaje:string, errores:string[], codigo:HttpStatus):Promise<RespuestaGenerica> {
        return new Promise((resolver) => {
            if(mensaje!='') {
                return resolver({
                    codigo,
                    mensaje
                });
            } else {
                return resolver({
                    codigo,
                    errores
                });
            }
        });
    }
    
}