import { Controller, Get, HttpCode, HttpStatus, Query, Param, Res, UseGuards } from '@nestjs/common';
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
        summary: 'Grupos del evento por nombre y/o lenguaje',
        description: 'Busqueda de grupos activos en el evento por nombre y/o lenguaje'
    })
    @ApiOkResponse({
        description: 'Detalle de los grupos',
        type: GroupsDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('/search')
    @HttpCode(HttpStatus.OK)
	async groupContainsName(
        @Res() res:Response,
        @IdUser() idUser:string,
        @Query("name") name:string,
        @Query("language") language:string): Promise<void> {
        res.send(await this._groupsService.groupNameAndLanguage(idUser, name, language));
	}

}
