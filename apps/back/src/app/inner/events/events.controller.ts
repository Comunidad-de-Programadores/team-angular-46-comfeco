import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { EventDto, GenericResponse } from '@comfeco/interfaces';

import { EventsService } from './events.service';
import { AccessGuard } from '../../../config/guard/access.guard';

@ApiTags('Evento')
@Controller('events')
@UseGuards(AccessGuard)
@ApiBearerAuth('access-token-service')
export class EventsController {

    constructor(private readonly _eventsService: EventsService) {}

    @ApiOperation({
        summary: 'Patrocinadores del evento',
        description: 'Patrocinadores que contribuyen al evento'
    })
    @ApiOkResponse({
        description: 'Información de los patrocinadores del evento',
        type: EventDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
	async event(@Res() res:Response): Promise<void> {
        res.send(await this._eventsService.event());
	}

}
