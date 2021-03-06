import { Body, Controller, Get, Post, Res, Patch, Req, Put, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation,  ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { GenericResponse, RegisterDto, LoginDto, TokenDto, RecoverAccountDto, ChangePasswordDto } from '@comfeco/interfaces';

import { BasicService } from './basic.service';
import { IdUser } from '../../../config/guard/access.decorator';
import { TokenResponseDto } from '../tokensResponse';
import { AuthService } from '../auth.service';
import { AccessGuard } from '../../../config/guard/access.guard';
import { JwtUtil } from '../../../util/jwt/jwt.util';
import { RefreshGuard } from '../../../config/guard/refresh.guard';
import { CookieGuard } from '../../../config/guard/cookie.enum';

@Controller('auth')
@ApiTags('Autenticación')
export class BasicController {

    constructor(
        private readonly _basicService: BasicService,
        private readonly _authService: AuthService
    ){}
    

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
        type: GenericResponse,
    })
    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
	async register(@Res() res:Response, @Body() registerDto:RegisterDto): Promise<void> {
        const tokens:TokenResponseDto = await this._basicService.register(registerDto);
        this._authService.setCookies(res, tokens, HttpStatus.CREATED);
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
        type: GenericResponse,
    })
    @Post('/login')
    @HttpCode(HttpStatus.OK)
	async login(@Res() res:Response, @Body() loginDto:LoginDto): Promise<void> {
        const tokens:TokenResponseDto = await this._basicService.login(loginDto);
        this._authService.setCookies(res, tokens, HttpStatus.OK);
	}


    @ApiOperation({
        summary: 'Renovación de token',
        description: 'Validar que el refresh token no ha expirado y creación de un nuevo token de acceso y de refresh'
    })
    @ApiOkResponse({
        description: 'Refresh Token válido',
        type: TokenDto,
    })
    @ApiUnauthorizedResponse({
        description: "Token invalido o expirado",
        type: GenericResponse
    })
    @Get('/refresh_token')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshGuard)
    @ApiBearerAuth('access-token-service')
	async validateRefreshToken(@Req() req:Request, @Res() res:Response, @IdUser() id:string): Promise<void> {
        const token:string = JwtUtil.getTokenCookie(req, CookieGuard.REFRESH);
        const tokens:TokenResponseDto = await this._basicService.renewToken(id, token);
        this._authService.setCookies(res, tokens, HttpStatus.OK);
    }


    @ApiOperation({
        summary: 'Recuperación de cuenta',
        description: 'El servicio manda un correo electrónico con las indicaciones para recuperar la cuenta'
    })
    @ApiOkResponse({
        description: 'Correo enviado para recuperación de cuenta',
        type: GenericResponse,
    })
    @ApiForbiddenResponse({
        description: 'No se puede recuperar la cuenta',
        type: GenericResponse,
    })
    @HttpCode(HttpStatus.OK)
    @Patch('/recover_user_account')
	async recoverAccount(@Res() res:Response, @Body() renewPassword:RecoverAccountDto): Promise<void> {
        res.send(await this._basicService.recoverAccount(renewPassword));
	}


    @ApiOperation({
        summary: 'Cambio de contraseña',
        description: 'El servicio realiza el cambio de la contraseña del usuario'
    })
    @ApiAcceptedResponse({
        description: 'La contraseña se modificó satisfactoriamente',
        type: GenericResponse,
    })
    @ApiBadRequestResponse({
        description: 'No se puede cambiar la contraseña',
        type: GenericResponse,
    })
    @Put('/change_password')
    @HttpCode(HttpStatus.ACCEPTED)
	async changePassword(@Res() res:Response, @Body() changePassword:ChangePasswordDto): Promise<void> {
        res.send(await this._basicService.changePassword(changePassword));
	}


    @ApiOperation({
        summary: 'Salir del aplicativo',
        description: 'Cerrar la sesión del usuario'
    })
    @ApiOkResponse({
        description: 'La sesión se ha cerrado',
        type: GenericResponse,
    })
    @ApiForbiddenResponse({
        description: 'No se puede cerrar sesión',
        type: GenericResponse,
    })
    @Get('/logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessGuard)
    @ApiBearerAuth('access-token-service')
	async logout(@Res() res:Response, @IdUser() id:string): Promise<void>  {
        const message:string = await this._basicService.logout(id);
        this._authService.cleanCookies(res, message);
	}

}
