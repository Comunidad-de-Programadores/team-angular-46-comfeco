import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { ExpresionRegex } from '../regexp/expresiones.regexp';
import { RecuperarCuentaDto } from './recuperar_cuenta.dto';

export class InicioDto extends RecuperarCuentaDto {
    
    @IsString()
    @IsNotEmpty({message: 'La contraseña es requerida'})
    @Matches(ExpresionRegex.PASSWORD, {message: 'Formato de contraseña incorrecto'})
    @ApiProperty({
        description: 'Contraseña de acceso',
        example: "7(HAg)'uZ%N6.exA",
        pattern: "Debe de contener letras mayúsculas, minúsculas, números y caracteres",
        minLength: 8,
    })
    readonly contrasenia: string;
    
}