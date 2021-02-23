import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from "express";

import { GenericResponse, GoogleLoginDto, TokenDto } from '@comfeco/interfaces';

import { GoogleService } from './google.service';

@ApiTags('Autenticación')
@ApiTags('Google')
@Controller('auth/google')
export class GoogleController {

    constructor( private _googleService: GoogleService ){}

    @ApiOperation({
        summary: 'Verificación de autenticación con google',
        description: 'Se realiza verificación de los datos obtenidos por el usuario directamente en el api de google'
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
    async verify(@Res() res:Response, @Body() googleDto:GoogleLoginDto): Promise<any> {
        const user = await this._googleService.login(googleDto);

        res.status(user.code).send(user);
    }

}

