import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { EventDto, GenericResponse } from '@comfeco/interfaces';

import { UserGuard } from '../../config/guard/user.guard';
import { EventsService } from './events.service';

@ApiTags('Evento')
@UseGuards(UserGuard)
@Controller('events')
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
	async event(@Res() res:Response): Promise<void> {
        const event = await this._eventsService.event();
        res.status(event.code).send(event);
	}

}
