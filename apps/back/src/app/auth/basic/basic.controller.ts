import { Body, Controller, Get, Post, Res, UseGuards, Patch, Req, Put, HttpStatus } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation,  ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { GenericResponse, RegisterDto, LoginDto, TokenDto, RecoverAccountDto, ChangePasswordDto } from '@comfeco/interfaces';

import { BasicService } from './basic.service';
import { ParameterToken } from '../../../config/guard/user.decorator';
import { UserGuard } from '../../../config/guard/user.guard';
import { JwtUtil } from '../../../util/jwt/jwt.util';

@ApiTags('Autenticación')
@Controller('auth')
export class BasicController {

    constructor(
        private _jwtUtil: JwtUtil,
        private _basicService: BasicService
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
	async register(@Res() res:Response, @Body() registerDto:RegisterDto): Promise<void> {
        const user = await this._basicService.register(registerDto);

        res.status(user.code).send(user);
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
	async login(@Res() res:Response, @Body() loginDto:LoginDto): Promise<void> {
        const user = await this._basicService.userExists(loginDto);

        res.status(user.code).send(user);
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
        type: GenericResponse
    })
    @Get('/validate_token')
    @UseGuards(UserGuard)
    @ApiBearerAuth('access-token-service')
	async validateRefreshToken(@Req() req:Request, @Res() res:Response, @ParameterToken('user') user:string): Promise<void> {
        const token = this._jwtUtil.getToken(req);
        const newToken = await this._basicService.renewToken(user, token);

        res.status(newToken.code).send(newToken);
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
    @Patch('/recover_user_account')
	async recoverAccount(@Res() res:Response, @Body() renewPassword:RecoverAccountDto): Promise<void> {
        const user = await this._basicService.recoverAccount(renewPassword);

        res.status(user.code).send(user);
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
	async changePassword(@Res() res:Response, @Body() changePassword:ChangePasswordDto): Promise<void> {
        const user:GenericResponse = await this._basicService.changePassword(changePassword);

        res.status(user.code).send(user);
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
    @UseGuards(UserGuard)
    @ApiBearerAuth('access-token-service')
	async logout(@Res() res:Response, @ParameterToken('email') correo:string): Promise<void>  {
        const response = await this._basicService.logout(correo);

        res.status(response.code).send(response);
	}

}
