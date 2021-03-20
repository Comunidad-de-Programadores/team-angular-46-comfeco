import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from "express";

import { GenericResponse, GoogleLoginDto, TokenDto } from '@comfeco/interfaces';

import { GoogleService } from './google.service';
import { TokenResponseDto } from '../tokensResponse';
import { AuthService } from '../auth.service';

@ApiTags('Autenticación')
@ApiTags('Google')
@Controller('auth/google')
export class GoogleController {

    constructor(
        private readonly _googleService: GoogleService,
        private readonly _authService: AuthService
    ){}

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
    @HttpCode(HttpStatus.OK)
    async verify(@Res() res:Response, @Body() googleDto:GoogleLoginDto): Promise<void> {
        const tokens:TokenResponseDto = await this._googleService.login(googleDto);
        this._authService.setCookies(res, tokens, HttpStatus.OK);
    }

}

