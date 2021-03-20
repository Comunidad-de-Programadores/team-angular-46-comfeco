import { Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Controller, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Response } from "express";

import { FacebookLoginDto, GenericResponse, TokenDto } from '@comfeco/interfaces';

import { FacebookService } from './facebook.service';
import { TokenResponseDto } from '../tokensResponse';
import { AuthService } from '../auth.service';

@ApiTags('Autenticación')
@Controller('auth/facebook')
export class FacebookController {

    constructor(
        private readonly _facebookService: FacebookService,
        private readonly _authService: AuthService
    ){}

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
    @HttpCode(HttpStatus.OK)
    async verify(@Res() res:Response, @Body() facebookDto:FacebookLoginDto): Promise<void> {
        const tokens:TokenResponseDto = await this._facebookService.login(facebookDto);
        this._authService.setCookies(res, tokens, HttpStatus.OK);
    }

}
