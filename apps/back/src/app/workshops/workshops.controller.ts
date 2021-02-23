import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AreasDto, GenericResponse, WorkshopsAreaDto } from '@comfeco/interfaces';

import { UserGuard } from '../../config/guard/user.guard';
import { WorkshopsService } from './workshops.service';

@UseGuards(UserGuard)
@Controller()
@ApiTags('Talleres')
@ApiBearerAuth('access-token-service')
export class WorkshopsController {

    constructor(private readonly _workshopsService: WorkshopsService) {}

    @ApiOperation({
        summary: 'Áreas de conocimiento',
        description: 'Áreas en las que se imparten talleres'
    })
    @ApiOkResponse({
        description: 'Nombre y id de las áreas',
        type: AreasDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('/knowledge_area')
	async knowledgeArea(@Res() res:Response): Promise<void> {
        const knowledges = await this._workshopsService.knowledgeArea();
        res.status(knowledges.code).send(knowledges);
	}

    @ApiOperation({
        summary: 'Talleres a impartir en un área especifica',
        description: 'Talleres que serán impartidos hoy o en un futuro en un área en especifico'
    })
    @ApiOkResponse({
        description: 'Detalle de los talleres que se van a impartir',
        type: WorkshopsAreaDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('/workshops_area/:area')
	async workshopsArea(@Res() res:Response, @Param('area') area:string): Promise<void> {
        const workshops = await this._workshopsService.workshopsArea(area);
        res.status(workshops.code).send(workshops);
	}

    @ApiOperation({
        summary: 'Talleres impartidos o a impartir',
        description: 'Talleres que serán impartidos o que ya finalizaron'
    })
    @ApiOkResponse({
        description: 'Detalle de los talleres',
        type: WorkshopsAreaDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('/workshops/all')
	async workshopsAll(@Res() res:Response): Promise<void> {
        const workshops = await this._workshopsService.workshopsAll();
        res.status(workshops.code).send(workshops);
	}

}
