import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { RespuestaGenerica } from '@comfeco/interfaces';

import { ParametrosExcepcion } from '../exceptions/index';

@Injectable()
export class ValidarServicioPipe implements PipeTransform<any> {

    async transform(valor:any, { metatype }:ArgumentMetadata) {
        if (!metatype || !this._validarMeta(metatype)) {
            return valor;
        }
        const objeto = plainToClass(metatype, valor);
        const errores = await validate(objeto);

        if (errores.length > 0) {
            const respuesta:RespuestaGenerica = {
                codigo: HttpStatus.BAD_REQUEST,
                errores: this._estraccionErrores(errores)
            };

            throw new ParametrosExcepcion(respuesta);
        }

        return valor;
    }

    private _estraccionErrores(errores:any): any[] {
        const mensajesError:any[] = new Array(errores.length);

        for(let error=0; error<errores.length; error++) {
            for(const constrain in errores[error].constraints) {
                const propiedad:any = {};
                
                propiedad[errores[error].property] = errores[error].constraints[constrain];
                
                mensajesError[error] = propiedad;
            }
        }

        return mensajesError;
    }

    private _validarMeta(meta:Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(meta);
    }
    
}