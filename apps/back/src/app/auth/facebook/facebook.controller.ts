import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from "express";

import { FacebookService } from './facebook.service';

@ApiTags('Autenticación')
@Controller('auth/facebook')
export class FacebookController {

    constructor( private _facebookService: FacebookService ){}


    @ApiOperation({
        summary: 'Ingresar con facebook',
        description: 'Muestra la pantalla para ingresar con una cuenta de facebook'
    })
    @Get()
    @UseGuards(AuthGuard("facebook"))
    pantallaIngreso() {
        return HttpStatus.OK;
    }
    
    
    @Get("respuesta")
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request, @Res() res:Response): Promise<any> {
        const usuario = await this._facebookService.ingresar(req);

        res.status(usuario.errores ? usuario.codigo : HttpStatus.OK).send(usuario);
    }
    
}
