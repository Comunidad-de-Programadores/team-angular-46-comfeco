import { Controller, Get, Res, Req, Put, Body, UseInterceptors, UploadedFile, HttpStatus, HttpCode, UseGuards, Post } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from 'express';

import { EventDayDto, EventsDayDto, GenericResponse, GroupRequest, InsigniasDto, RecentActivitiesDto, UserChangeInformationDto, UserDto, UserGroupDto } from '@comfeco/interfaces';

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
        summary: 'El usuario desea participar en un evento',
        description: 'Se agrega un evento a la lista del usuario'
    })
    @ApiOkResponse({
        description: 'Información del evento al que se agrego',
        type: EventsDayDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Post('add_event')
    @HttpCode(HttpStatus.OK)
	async addEvent(@Res() res:Response, @Body() event:EventDayDto, @IdUser() id:string): Promise<void> {
        res.send(await this._userService.addEvent(event, id));
	}

    @ApiOperation({
        summary: 'El usuario desea salirse de un evento en el que participa',
        description: 'Se elimina un evento de la lista del usuario'
    })
    @ApiAcceptedResponse({
        description: 'Información del evento al que se agrego',
        type: EventsDayDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Put('leave_event')
    @HttpCode(HttpStatus.OK)
	async leaveEvent(@Res() res:Response, @Body() event:EventDayDto, @IdUser() id:string): Promise<void> {
        res.send(await this._userService.leaveEvent(event, id));
	}

    @ApiOperation({
        summary: 'Actividad reciente en la cuenta del usuario',
        description: 'Se muestran los eventos que han sido agregados, de los que se ha salido y las medallas obtenidas por el usuario recientemente'
    })
    @ApiOkResponse({
        description: 'Información de la actividad reciente del usuario',
        type: RecentActivitiesDto,
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
        summary: 'Grupo al que pertenece el usuario',
        description: 'Grupo al que esta suscrito el usuario'
    })
    @ApiOkResponse({
        description: 'Información del grupo y de los integrantes del grupo al que esta suscrito el usuario',
        type: UserGroupDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('group')
    @HttpCode(HttpStatus.OK)
	async group(@Res() res:Response, @IdUser() id:string): Promise<void> {
        res.send(await this._userService.group(id));
	}

    @ApiOperation({
        summary: 'El usuario se puede unir a un grupo',
        description: 'Hacer miembro al usuario de un grupo'
    })
    @ApiOkResponse({
        description: 'El usuario se unio correctamente al grupo',
        type: UserGroupDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Post('join_group')
    @HttpCode(HttpStatus.OK)
	async joinGroup(@Res() res:Response, @Body() idGrupo:GroupRequest, @IdUser() id:string): Promise<void> {
        res.send(await this._userService.joinGroup(idGrupo, id));
	}

    @ApiOperation({
        summary: 'El usuario abandona el grupo al que pertenece',
        description: 'El usuario abandona el grupo al que esta suscrito'
    })
    @ApiOkResponse({
        description: 'Mensaje para saber si se pudo o no salir correctamente del grupo',
        type: GenericResponse,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Put('leave_group')
    @HttpCode(HttpStatus.OK)
	async leaveGroup(@Res() res:Response, @IdUser() id:string): Promise<void> {
        res.send(await this._userService.leaveGroup(id));
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
        @Req() req:Request,
        @UploadedFile() file:any,
        @IdUser() id:string,
        @Body() changeInformation:UserChangeInformationDto,
        @Res() res:Response
    ) {
        const token:string = JwtUtil.getTokenCookie(req, CookieGuard.AUTHENTICATION);
        res.send(await this._userService.changeInformation(file, id, changeInformation, token));
    }
    
}