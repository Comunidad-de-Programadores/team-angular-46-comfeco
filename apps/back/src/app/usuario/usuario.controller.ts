import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { RespuestaGenerica, UsuarioDto } from '@comfeco/interfaces';

import { UsuarioGuard } from '../../config/guard/usuario.guard';
import { UsuarioService } from './usuario.service';
import { ParametroToken } from '../../config/guard/usuario.decorator';

@ApiTags('Usuario')
@Controller('usuario')
@ApiBearerAuth('access-token-service')
export class UsuarioController {

    constructor( private _usuarioService: UsuarioService ){}

    
    @ApiOperation({
        summary: 'Datos del usuario',
        description: 'Información del usuario para mostrar en el aplicativo'
    })
    @ApiOkResponse({
        description: 'Usuario encontrado',
        type: UsuarioDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: RespuestaGenerica,
    })
    @Get()
    @UseGuards(UsuarioGuard)
	async informacion(@Res() res:Response, @ParametroToken('usuario') usuario:string): Promise<void> {
        const informacionUsuario = await this._usuarioService.informacionUsuario(usuario);
        res.status(informacionUsuario.codigo).send(informacionUsuario);
	}
    
}
