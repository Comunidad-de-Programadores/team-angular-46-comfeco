import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RecuperarCuentaDto {
    
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

}