import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RespuestaGenerica {

    @ApiProperty({
        description: 'Código de error de la solicitud',
        example: 0,
    })
    readonly codigo: number;

    @ApiProperty({
        description: 'Respuesta de la solicitud',
        example: "Exito en la operación",
    })
    @ApiPropertyOptional()
    readonly mensaje?: string;

    @ApiProperty({
        description: 'Errores presentados en la ejecución del servicio',
        examples: ['Problema 1', 'Problema 2', 'Problema 3'],
        enum: ['Problema 1', 'Problema 2', 'Problema 3'],
        type: [String]
    })
    @ApiPropertyOptional()
    readonly errores?: any[];

}