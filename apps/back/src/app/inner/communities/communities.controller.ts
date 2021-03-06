import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CommunitiesDto, GenericResponse } from '@comfeco/interfaces';

import { CommunitiesService } from './communities.service';
import { AccessGuard } from '../../../config/guard/access.guard';

@UseGuards(AccessGuard)
@ApiTags('Comunidades')
@Controller('communities')
@ApiBearerAuth('access-token-service')
export class CommunitiesController {

    constructor(private readonly _communitiesService: CommunitiesService) {}

    @ApiOperation({
        summary: 'Primeras comunidades a las que se pueden unir los usuarios',
        description: 'Se muestran los enlaces a las primeras tres comunidades para unirse'
    })
    @ApiOkResponse({
        description: 'Detalle de las comunidades',
        type: CommunitiesDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
	async communitiesFirstThree(@Res() res:Response): Promise<void> {
        res.send(await this._communitiesService.communitiesFirstThree());
	}

    @ApiOperation({
        summary: 'Todas las comunidades a las que se pueden unir los usuarios',
        description: 'Se muestran los enlaces a todas las comunidades para unirse'
    })
    @ApiOkResponse({
        description: 'Detalle de las comunidades',
        type: CommunitiesDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get('/all')
    @HttpCode(HttpStatus.OK)
	async communitiesAll(@Res() res:Response): Promise<void> {
        res.send(await this._communitiesService.communitiesAll());
	}

}
