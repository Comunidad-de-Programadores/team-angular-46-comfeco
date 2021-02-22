import { Controller, UseGuards, Res, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { ExhibitorsDto, GenericResponse } from '@comfeco/interfaces';

import { UserGuard } from '../../config/guard/user.guard';
import { ExhibitorsService } from './exhibitors.service';

@UseGuards(UserGuard)
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
	async exhibitors(@Res() res:Response): Promise<void> {
        const exhibitors = await this._exhibitorsService.exhibitors();
        res.status(exhibitors.code).send(exhibitors);
	}
    
}
