import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

import { ExpresionRegex } from '../regexp/expresiones.regexp';

export class InicioDto {
    
    @IsOptional()
    @IsString({message: 'El campo usuario solo admite caracteres'})
    @ApiProperty({
        description: 'Pseudonimo del usuario',
        example: "prueba",
    })
    @ApiPropertyOptional()
    readonly usuario?: string;
    
    @IsOptional()
    @IsEmail({}, { message: 'Formato de correo inválido'})
    @ApiProperty({
        description: 'Correo con el que se accede al aplicativo',
        example: "prueba@prueba.com",
        format: "El correo debe de tener un formato válido"
    })
    @ApiPropertyOptional()
    readonly correo?: string;

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