import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

import { GenericResponse, TechnologiesDto } from '@comfeco/interfaces';

import { AccessGuard } from '../../../config/guard/access.guard';
import { TechnologiesService } from './technologies.service';

@ApiTags('Tecnologias')
@UseGuards(AccessGuard)
@Controller('technologies')
@ApiBearerAuth('access-token-service')
export class TechnologiesController {

    constructor(private readonly _technologiesService: TechnologiesService) {}

    @ApiOperation({
        summary: 'Tecnologías de los lenguajes',
        description: 'Lenguajes usados en el evento'
    })
    @ApiOkResponse({
        description: 'Detalle de las tecnologías',
        type: TechnologiesDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
	async technologies(@Res() res:Response): Promise<void> {
        res.send(await this._technologiesService.technologies());
	}

}
