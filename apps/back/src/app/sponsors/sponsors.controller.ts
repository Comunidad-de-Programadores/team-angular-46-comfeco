import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { UserGuard } from '../../config/guard/user.guard';
import { SponsorsService } from './sponsors.service';
import { GenericResponse, SponsorsDto } from '@comfeco/interfaces';

@UseGuards(UserGuard)
@Controller('sponsors')
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
	async sponsors(@Res() res:Response): Promise<void> {
        const sponsors = await this._sponsorsService.sponsors();
        res.status(sponsors.code).send(sponsors);
	}

}
