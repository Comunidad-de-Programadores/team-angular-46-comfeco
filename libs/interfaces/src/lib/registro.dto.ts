import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

import { ExpresionRegex } from './../regexp/expresiones.regexp';

export class RegistroDto {
    
    @IsOptional()
    @IsString({message: 'El campo nombre solo admite caracteres'})
    @ApiProperty({
        description: 'Nombre del usuario a registrar',
        example: "Diego",
    })
    @ApiPropertyOptional()
    readonly nombre?:string;

    @IsOptional()
    @IsString({message: 'El campo apellido paterno solo admite caracteres'})
    @ApiProperty({
        description: 'Apellido paterno del usuario a registrar',
        example: "Garcia",
    })
    @ApiPropertyOptional()
    readonly apellido_paterno?:string;

    @IsOptional()
    @IsString({message: 'El campo apellido materno solo admite caracteres'})
    @ApiProperty({
        description: 'Apellido materno del usuario a registrar',
        example: "Hernandez",
    })
    @ApiPropertyOptional()
    readonly apellido_materno?:string;

    @IsNotEmpty({message: 'El usuario es requerido'})
    @IsString({message: 'El campo usuario solo admite caracteres'})
    @ApiProperty({
        description: 'Pseudonimo del usuario',
        example: "prueba",
    })
    readonly usuario: string;
    
    @IsNotEmpty({message: 'El correo es requerido'})
    @IsEmail({}, { message: 'Formato de correo inválido'})
    @ApiProperty({
        description: 'Correo con el que se accede al aplicativo',
        example: "prueba@prueba.com",
        format: "El correo debe de tener un formato válido"
    })
    readonly correo: string;

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
    
    @IsOptional()
    @ApiProperty({
        description: 'Validación de términos y condiciones',
        example: true,
        default: false
    })
    @ApiPropertyOptional()
    readonly terminos?: boolean = false;

}