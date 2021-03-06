import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GenericResponse, SponsorsDto } from '@comfeco/interfaces';

import { SponsorsService } from './sponsors.service';
import { AccessGuard } from '../../../config/guard/access.guard';

@Controller('sponsors')
@UseGuards(AccessGuard)
@ApiTags('Patrocinadores')
@ApiBearerAuth('access-token-service')
export class SponsorsController {

    constructor(private readonly _sponsorsService: SponsorsService) {}

    @ApiOperation({
        summary: 'Patrocinadores del evento',
        description: 'Patrocinadores que contribuyen al evento'
    })
    @ApiOkResponse({
        description: 'Información de los patrocinadores del evento',
        type: SponsorsDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
	async sponsors(@Res() res:Response): Promise<void> {
        res.send(await this._sponsorsService.sponsors());
	}

}
