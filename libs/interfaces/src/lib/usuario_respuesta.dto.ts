import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Rol } from '../enum/roles.enum';
import { RespuestaGenerica } from './respuesta_generica.dto';

export class UsuarioDto extends RespuestaGenerica {
    
    @ApiProperty({
        description: 'Nombre del usuario',
        example: "Diego",
    })
    @ApiPropertyOptional()
    readonly nombre?:string;

    @ApiProperty({
        description: 'Apellido paterno del usuario',
        example: "Garcia",
    })
    @ApiPropertyOptional()
    readonly apellido_paterno?:string;

    @ApiProperty({
        description: 'Apellido materno del usuario',
        example: "Hernandez",
    })
    @ApiPropertyOptional()
    readonly apellido_materno?:string;

    @ApiProperty({
        description: 'Pseudonimo del usuario',
        example: "prueba",
    })
    readonly usuario: string;

    @ApiProperty({
        description: 'Correo con el que se accede al aplicativo',
        example: "prueba@prueba.com",
        format: "El correo debe de tener un formato válido"
    })
    readonly correo: string;

    @ApiProperty({
        description: 'Roles con los que cuenta el usuario',
        examples: ['INVITADO'],
        enum: [ Rol.INVITADO ],
        type: [String]
    })
    readonly roles: Rol[];

}