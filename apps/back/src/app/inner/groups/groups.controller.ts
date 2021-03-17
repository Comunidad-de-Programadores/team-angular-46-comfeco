import { Controller, Get, HttpCode, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GenericResponse, GroupsDto } from '@comfeco/interfaces';

import { GroupsService } from './groups.service';
import { AccessGuard } from '../../../config/guard/access.guard';
import { IdUser } from '../../../config/guard/access.decorator';

@ApiTags('Grupos')
@Controller('groups')
@UseGuards(AccessGuard)
@ApiBearerAuth('access-token-service')
export class GroupsController {

    constructor(private readonly _groupsService: GroupsService) {}

    @ApiOperation({
        summary: 'Grupos del evento',
        description: 'Grupos activos en el evento'
    })
    @ApiOkResponse({
        description: 'Detalle de los grupos',
        type: GroupsDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
	async groups(@Res() res:Response, @IdUser() idUser:string): Promise<void> {
        res.send(await this._groupsService.groups(idUser));
	}

    @ApiOperation({
        summary: 'Grupos del evento por nombre',
        description: 'Busqueda de grupos activos en el evento por nombre'
    })
    @ApiOkResponse({
        description: 'Detalle de los grupos',
        type: GroupsDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('/name/:name')
    @HttpCode(HttpStatus.OK)
	async groupContainsName(@Res() res:Response, @IdUser() idUser:string, @Param('name') name:string): Promise<void> {
        res.send(await this._groupsService.groupContainsName(idUser, name));
	}

    @ApiOperation({
        summary: 'Grupo del evento por id',
        description: 'Busqueda de un grupo por id'
    })
    @ApiOkResponse({
        description: 'Detalle del grupo',
        type: GroupsDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('/language/:id')
    @HttpCode(HttpStatus.OK)
	async groupContainsId(@Res() res:Response, @IdUser() idUser:string, @Param('id') id:string): Promise<void> {
        res.send(await this._groupsService.groupByLanguage(idUser, id));
	}

}
