import { ApiProperty } from '@nestjs/swagger';

import { RespuestaGenerica } from './respuesta_generica.dto';

export class TokenDto extends RespuestaGenerica {
    
    @ApiProperty({
        description: 'Token de acceso al aplicativo',
        example: "asd513ads546ad"
    })
    readonly token: string;

    @ApiProperty({
        description: 'Pseudonimo del usuario',
        example: "prueba",
    })
    readonly usuario: string;

}