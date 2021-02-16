import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from "express";

import { GoogleService } from './google.service';

@ApiTags('Autenticación')
@ApiTags('Google')
@Controller('auth/google')
export class GoogleController {

    constructor( private _googleService: GoogleService ){}


    @ApiOperation({
        summary: 'Ingresar con google',
        description: 'Muestra la pantalla para ingresar con una cuenta de google'
    })
    @Get()
    @UseGuards(AuthGuard('google'))
    pantallaIngreso(@Res() resp:Response): void {
        resp.status(HttpStatus.OK);
    }

    
    @Get('respuesta')
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard('google'))
    async respuestaAutenticacion(@Req() req:Request, @Res() res:Response): Promise<void> {
        const usuario = await this._googleService.ingresar(req)

        res.status(usuario.errores ? usuario.codigo : HttpStatus.OK).send(usuario);
    }
    
}
