import { Controller, Get, Res, Req, Put, Body, UseInterceptors, UploadedFile, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from 'express';

import { EventsDayDto, GenericResponse, InsigniasDto, UserChangeInformationDto, UserDto } from '@comfeco/interfaces';

import { UserService } from './user.service';
import { IdUser } from '../../../config/guard/access.decorator';
import { JwtUtil } from '../../../util/jwt/jwt.util';
import { AccessGuard } from '../../../config/guard/access.guard';
import { CookieGuard } from '../../../config/guard/cookie.enum';

@ApiTags('Usuario')
@Controller('user')
@UseGuards(AccessGuard)
@ApiBearerAuth('access-token-service')
export class UserController {

    constructor(private readonly _userService: UserService){}

    
    @ApiOperation({
        summary: 'Datos del usuario',
        description: 'Información del usuario para mostrar en el aplicativo'
    })
    @ApiOkResponse({
        description: 'Usuario encontrado',
        type: UserDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
    async basicInformation(@Req() req:Request, @Res() res:Response, @IdUser() id:string): Promise<void> {
        const token:string = JwtUtil.getTokenCookie(req, CookieGuard.AUTHENTICATION);
        const userInformation = await this._userService.basicInformation(id, token);

        res.send(userInformation);
	}

    @ApiOperation({
        summary: 'Datos del perfil de usuario',
        description: 'Información para mostrar en el perfil del usuario'
    })
    @ApiOkResponse({
        description: 'Usuario encontrado',
        type: UserDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('profile')
    @HttpCode(HttpStatus.OK)
	async profileInformation(@Req() req:Request, @Res() res:Response, @IdUser() id:string): Promise<void> {
        const token:string = JwtUtil.getTokenCookie(req, CookieGuard.AUTHENTICATION);
        const userInformation = await this._userService.profileInformation(id, token);

        res.send(userInformation);
	}

    @ApiOperation({
        summary: 'Insignias del usuario',
        description: 'Insignias obtenidas por el usuario durante el evento'
    })
    @ApiOkResponse({
        description: 'Información de las insignias',
        type: InsigniasDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('insignias')
    @HttpCode(HttpStatus.OK)
	async insignias(@Res() res:Response, @IdUser() id:string): Promise<void> {
        res.send(await this._userService.insignias(id));
	}

    @ApiOperation({
        summary: 'Eventos del usuario',
        description: 'Eventos a los que asiste el usuario'
    })
    @ApiOkResponse({
        description: 'Información de los eventos',
        type: EventsDayDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('events')
    @HttpCode(HttpStatus.OK)
	async events(@Res() res:Response, @IdUser() id:string): Promise<void> {
        res.send(await this._userService.events(id));
	}

    @ApiOperation({
        summary: 'Eventos recientes del usuario',
        description: 'Se muestran los eventos que han sido agregados por el usuario el día de hoy'
    })
    @ApiOkResponse({
        description: 'Información de los eventos',
        type: EventsDayDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('recent_activity')
    @HttpCode(HttpStatus.OK)
	async recentActivity(@Res() res:Response, @IdUser() id:string): Promise<void> {
        res.send(await this._userService.recentActivity(id));
	}

    @ApiOperation({
        summary: 'Cambio de información del perfil',
        description: 'El servicio realiza la modificación de la información del perfil del usuario'
    })
    @ApiAcceptedResponse({
        description: 'La información se modificó satisfactoriamente',
        type: UserDto,
    })
    @ApiBadRequestResponse({
        description: 'No se puede cambiar la información',
        type: GenericResponse,
    })
    @HttpCode(HttpStatus.ACCEPTED)
    @Put('/change_information')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file:any,
        @IdUser() id:string,
        @Body() changeInformation:UserChangeInformationDto,
        @Res() res:Response
    ) {
        res.send(await this._userService.changeInformation(file, id, changeInformation));
    }
    
}