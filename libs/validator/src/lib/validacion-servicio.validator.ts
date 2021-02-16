import { ExpresionRegex, RespuestaGenerica } from "@comfeco/interfaces";

import { RespuestaUtil } from "./respuestas.util";

export class ValidarServicio {

    static correo(correo:string, respuesta:RespuestaGenerica): RespuestaGenerica {
        let mensaje:string;

        if(this._esVacio(correo)) {
            mensaje = 'El correo es un campo requerido';
        }

        if(!ExpresionRegex.EMAIL.test(correo)) {
            mensaje = 'El correo debe de tener un formato válido';
        }

        return this._rellenarErrores(mensaje, respuesta);
    }

    static usuario(usuario:string, respuesta:RespuestaGenerica): RespuestaGenerica {
        let mensaje:string;

        if(this._esVacio(usuario)) {
            mensaje = 'El usuario es necesario enviarlo';
        }

        return this._rellenarErrores(mensaje, respuesta);
    }

    static contrasenia(contrasenia:string, respuesta:RespuestaGenerica): RespuestaGenerica {
        let mensaje:string;

        if(this._esVacio(contrasenia)) {
            mensaje = 'La contraseña es requerida';
        }

        if(!ExpresionRegex.PASSWORD.test(contrasenia)) {
            mensaje = 'La contrasenia debe de contener letras mayúsculas, minúsculas, números y caracteres';
        }

        return this._rellenarErrores(mensaje, respuesta);
    }

    static token(token:string, respuesta:RespuestaGenerica): RespuestaGenerica {
        let mensaje:string;

        if(this._esVacio(token)) {
            mensaje = 'El campo token es necesario que se envíe';
        }

        return this._rellenarErrores(mensaje, respuesta);
    }

    private static _esVacio(cadena:string): boolean {
        if(cadena === null) return true;
        if(cadena === undefined) return true;
        if(cadena.trim() === '') return true;
        return false;
    }

    private static _rellenarErrores(mensaje:string, respuesta:RespuestaGenerica): RespuestaGenerica {
        let errores:string[] = [];
            
        if(respuesta!=null && respuesta!=undefined) {
            errores = [...respuesta.errores];
        }
        
        if(mensaje!=null) {
            if(errores.length>0) {
                errores.push(mensaje);
            } else {
                errores = [mensaje];
            }
        }

        if(errores.length>0) {
            return RespuestaUtil.respuestaGenerica('', errores, 400);
        } else {
            return null;
        }
    }

}