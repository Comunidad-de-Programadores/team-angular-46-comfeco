import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { GenericResponse } from '@comfeco/interfaces';

import { ParametersExcepcion } from '../exceptions/index';

@Injectable()
export class ValidateServicePipe implements PipeTransform<any> {

    async transform(value:any, { metatype }:ArgumentMetadata) {
        if (!metatype || !this._validateMeta(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            const response:GenericResponse = {
                code: HttpStatus.BAD_REQUEST,
                errors: this._extractionErrors(errors)
            };

            throw new ParametersExcepcion(response);
        }

        return value;
    }

    private _extractionErrors(errors:any): any[] {
        const messagesError:any[] = new Array(errors.length);

        for(let error=0; error<errors.length; error++) {
            for(const constrain in errors[error].constraints) {
                const property:any = {};
                
                property[errors[error].property] = errors[error].constraints[constrain];
                
                messagesError[error] = property;
            }
        }

        return messagesError;
    }

    private _validateMeta(meta:Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(meta);
    }
    
}