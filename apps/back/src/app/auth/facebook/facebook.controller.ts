import { Body, Post } from '@nestjs/common';
import { Controller, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from "express";

import { FacebookLoginDto, GenericResponse, TokenDto } from '@comfeco/interfaces';

import { FacebookService } from './facebook.service';

@ApiTags('Autenticación')
@Controller('auth/facebook')
export class FacebookController {

    constructor( private _facebookService: FacebookService ){}

    @ApiOperation({
        summary: 'Verificación de autenticación con facebook',
        description: 'Se realiza verificación de los datos obtenidos por el usuario directamente en el api de facebook'
    })
    @ApiOkResponse({
        description: 'Token de acceso al aplicativo',
        type: TokenDto,
    })
    @ApiUnauthorizedResponse({
        description: "No se autentica correctamente el usuario",
        type: GenericResponse,
    })
    @Post("verify")
    async verify(@Res() res:Response, @Body() facebookDto:FacebookLoginDto): Promise<any> {
        const user = await this._facebookService.login(facebookDto);

        res.status(user.code).send(user);
    }

}
