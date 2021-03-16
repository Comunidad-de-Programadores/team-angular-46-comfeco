import { pipe, of, UnaryFunction, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ExpresionRegex, GenericResponse, ResponseService, TokenDto } from '@comfeco/interfaces';

import { UtilResponse } from "./answers.util";

export class ValidatorService {
  
  static changeBasicResponse(): UnaryFunction<Observable<GenericResponse>, Observable<ResponseService>> {
    return pipe(
      catchError(({error}) => of({ code: error.code, errors: error.errors, success: false })),
      map((resp:GenericResponse) => ({
        success: resp?.errors ? false : true,
        message: resp?.message ? resp.message : resp?.errors ? resp.errors.join(', ') : '',
        ...resp
      }))
    )
  };

  static changeErrorAuthResponse(): UnaryFunction<Observable<GenericResponse | TokenDto>, Observable<ResponseService | TokenDto>> {
    return pipe(
      catchError(({error}) => of({ code: error.code, errors: error.errors, success: false })),
      map((resp:any) => {
        return {
        success: resp?.errors ? false : true,
        message: resp?.errors ? resp.errors.join(' ') : resp.message,
        ...resp
      }})
    )
  };

  static email(email:string, response:GenericResponse): GenericResponse {
    let message:string;

    if(this._isEmpty(email)) {
      message = 'El correo es un campo requerido';
    }

    if(message==undefined && !ExpresionRegex.EMAIL.test(email)) {
      message = 'El correo debe de tener un formato válido';
    }

    return this._fillErrors(message, response);
  }

  static id(id:string, response:GenericResponse): GenericResponse {
    let message:string;

    if(this._isEmpty(id)) {
      message = 'El id es necesario enviarlo';
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

    if(message==undefined && contrasenia.length<8) {
      message = 'La contraseña debe de contener minimo 8 caracteres';
    }

    if(message==undefined && !ExpresionRegex.PASSWORD.test(contrasenia)) {
      message = 'La contraseña debe de contener letras mayúsculas, minúsculas, números y caracteres especiales';
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