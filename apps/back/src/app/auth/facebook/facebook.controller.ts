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
    pageLogin() {
        return HttpStatus.OK;
    }
    
    
    @Get("respuesta")
    @ApiExcludeEndpoint()
    @UseGuards(AuthGuard("facebook"))
    async login(@Req() req: Request, @Res() res:Response): Promise<any> {
        const user = await this._facebookService.login(req);

        res.status(user.code).send(user);
    }
    
}
