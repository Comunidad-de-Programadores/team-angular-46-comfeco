import { Controller, Res, Get, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { ExhibitorsDto, GenericResponse } from '@comfeco/interfaces';

import { ExhibitorsService } from './exhibitors.service';
import { AccessGuard } from '../../../config/guard/access.guard';

@UseGuards(AccessGuard)
@ApiTags('Expositores')
@Controller('exhibitors')
@ApiBearerAuth('access-token-service')
export class ExhibitorsController {

    constructor(private readonly _exhibitorsService: ExhibitorsService) {}

    @ApiOperation({
        summary: 'Expositores del evento',
        description: 'Personas que contribuyen y hacen posible el evento'
    })
    @ApiOkResponse({
        description: 'Información de los participantes del evento',
        type: ExhibitorsDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
	async exhibitors(@Res() res:Response): Promise<void> {
        res.send(await this._exhibitorsService.exhibitors());
	}
    
}
