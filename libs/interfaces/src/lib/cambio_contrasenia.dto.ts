import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { ExpresionRegex } from './../regexp/expresiones.regexp';

export class CambioContraseniaDto {
    
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
    
    @IsString({message: 'El campo token es necesario que se envíe'})
    @ApiProperty({
        description: 'Token generado para poder realizar la restauración de la contraseña',
        example: "4a!%ds6=54ad*]_561ca3s15#$*-_",
    })
    @ApiPropertyOptional()
    readonly token: string;

}