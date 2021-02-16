import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation,  ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { RespuestaGenerica, RegistroDto, InicioDto, TokenDto } from '@comfeco/interfaces';

import { BasicoService } from './basico.service';
import { ParametroToken } from '../../../config/guard/usuario.decorator';
import { UsuarioGuard } from '../../../config/guard/usuario.guard';

@ApiTags('Autenticación')
@Controller('auth')
export class BasicoController {

    constructor(private _basicoService: BasicoService){}
    

    @ApiOperation({
        summary: 'Registro de usuario',
        description: 'Registro en la plataforma'
    })
    @ApiCreatedResponse({
        description: 'Alta exitosa del usuario',
        type: TokenDto,
    })
    @ApiBadRequestResponse({
        description: "No se mandan los parámetros correctamente",
        type: RespuestaGenerica,
    })
    @Post('/registro')
	async registro(@Res() res:Response, @Body() registroDto:RegistroDto): Promise<void> {
        const usuario = await this._basicoService.registro(registroDto);

        if(usuario.errores) {
            res.status(usuario.codigo).send(usuario);
        } else {
            res.status(HttpStatus.CREATED).send(usuario);
        }
	}


    @ApiOperation({
        summary: 'Inicio de sesión',
        description: 'Ingreso en la plataforma'
    })
    @ApiOkResponse({
        description: 'Acceso concedido',
        type: TokenDto,
    })
    @ApiUnauthorizedResponse({
        description: "No se mandan los parámetros correctamente",
        type: RespuestaGenerica,
    })
    @Post('/ingreso')
	async ingresar(@Res() res:Response, @Body() inicioDto:InicioDto): Promise<void> {
        const usuario = await this._basicoService.existeUsuario(inicioDto);

        res.status(usuario.errores ? usuario.codigo : HttpStatus.OK).send(usuario);
	}


    @ApiOperation({
        summary: 'Validación de token',
        description: 'Validar que el token no ha expirado'
    })
    @ApiOkResponse({
        description: 'Token válido',
        type: TokenDto,
    })
    @ApiUnauthorizedResponse({
        description: "Token invalido o expirado",
        type: RespuestaGenerica
    })
    @Get('/validar_token')
    @UseGuards(UsuarioGuard)
    @ApiBearerAuth('access-token-service')
	async validarRefrescarToken(@Req() req:Request, @Res() res:Response, @ParametroToken('usuario') usuario:string): Promise<void> {
        const encabezados:any = req.headers;
        const token = encabezados.authorization.substring(7);
        const tokenNuevo = await this._basicoService.renovarToken(usuario, token);

        if(tokenNuevo.errores) {
            res.status(tokenNuevo.codigo).send(tokenNuevo);
        } else {
            res.status(HttpStatus.OK).send(tokenNuevo);
        }
    }


    @ApiOperation({
        summary: 'Salir del aplicativo',
        description: 'Cerrar la sesión del usuario'
    })
    @ApiOkResponse({
        description: 'La sesión se ha cerrado',
        type: RespuestaGenerica,
    })
    @ApiForbiddenResponse({
        description: 'No se puede cerrar sesión',
        type: RespuestaGenerica,
    })
    @Get('/salir')
    @UseGuards(UsuarioGuard)
    @ApiBearerAuth('access-token-service')
	async salir(@Res() res:Response, @ParametroToken('correo') correo:string): Promise<void>  {
        const respuesta = await this._basicoService.salir(correo);
        res.status(respuesta.codigo).send(respuesta);
	}
    
}
