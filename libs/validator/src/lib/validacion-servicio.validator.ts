import { ExpresionRegex, GenericResponse } from "@comfeco/interfaces";

import { UtilResponse } from "./respuestas.util";

export class ValidatorService {

    static email(email:string, response:GenericResponse): GenericResponse {
        let message:string;

        if(this._isEmpty(email)) {
            message = 'El correo es un campo requerido';
        }

        if(!ExpresionRegex.EMAIL.test(email)) {
            message = 'El correo debe de tener un formato válido';
        }

        return this._fillErrors(message, response);
    }

    static user(user:string, response:GenericResponse): GenericResponse {
        let message:string;

        if(this._isEmpty(user)) {
            message = 'El usuario es necesario enviarlo';
        }

        return this._fillErrors(message, response);
    }

    static password(contrasenia:string, response:GenericResponse): GenericResponse {
        let message:string;

        if(this._isEmpty(contrasenia)) {
            message = 'La contraseña es requerida';
        }

        if(!ExpresionRegex.PASSWORD.test(contrasenia)) {
            message = 'La contraseña debe de contener letras mayúsculas, minúsculas, números y caracteres';
        }

        return this._fillErrors(message, response);
    }

    static token(token:string, response:GenericResponse): GenericResponse {
        let message:string;

        if(this._isEmpty(token)) {
            message = 'El campo token es necesario que se envíe';
        }

        return this._fillErrors(message, response);
    }

    private static _isEmpty(field:string): boolean {
        if(field === null) return true;
        if(field === undefined) return true;
        if(field.trim() === '') return true;
        return false;
    }

    private static _fillErrors(message:string, response:GenericResponse): GenericResponse {
        let errors:string[] = [];
            
        if(response!=null && response!=undefined) {
            errors = [...response.errors];
        }
        
        if(message!=null) {
            if(errors.length>0) {
                errors.push(message);
            } else {
                errors = [message];
            }
        }

        if(errors.length>0) {
            return UtilResponse.genericResponse('', errors, 400);
        } else {
            return null;
        }
    }

}