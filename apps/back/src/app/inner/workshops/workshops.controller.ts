import { Controller, Get, HttpCode, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AreasDto, GenericResponse, WorkshopsAreaDto } from '@comfeco/interfaces';

import { WorkshopsService } from './workshops.service';
import { AccessGuard } from '../../../config/guard/access.guard';

@Controller()
@ApiTags('Talleres')
@UseGuards(AccessGuard)
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
    @HttpCode(HttpStatus.OK)
	async knowledgeArea(@Res() res:Response): Promise<void> {
        res.send(await this._workshopsService.knowledgeArea());
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
    @HttpCode(HttpStatus.OK)
    @Get('/workshops_area/:area')
	async workshopsArea(@Res() res:Response, @Param('area') area:string): Promise<void> {
        res.send(await this._workshopsService.workshopsArea(area));
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
    @HttpCode(HttpStatus.OK)
	async workshopsAll(@Res() res:Response): Promise<void> {
        res.send(await this._workshopsService.workshopsAll());
	}

}
