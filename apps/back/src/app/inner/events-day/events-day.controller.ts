import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { EventsDayDto, GenericResponse } from '@comfeco/interfaces';

import { EventsDayService } from './events-day.service';
import { AccessGuard } from '../../../config/guard/access.guard';
import { IdUser } from 'apps/back/src/config/guard/access.decorator';

@UseGuards(AccessGuard)
@Controller('events_day')
@ApiTags('Patrocinadores')
@ApiBearerAuth('access-token-service')
export class EventsDayController {

    constructor(private readonly _eventsDayService: EventsDayService) {}

    @ApiOperation({
        summary: 'Eventos realizados',
        description: 'Eventos realizados durante el desafio'
    })
    @ApiOkResponse({
        description: 'Información de los eventos que se llevan a cabo',
        type: EventsDayDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
	async events(@Res() res:Response, @IdUser() id:string): Promise<void> {
        res.send(await this._eventsDayService.events(id));
	}

}
