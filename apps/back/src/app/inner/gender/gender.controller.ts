import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GendersDto, GenericResponse } from '@comfeco/interfaces';

import { GenderService } from './gender.service';
import { AccessGuard } from '../../../config/guard/access.guard';

@ApiTags('Generos')
@Controller('genders')
@UseGuards(AccessGuard)
@ApiBearerAuth('access-token-service')
export class GenderController {

    constructor(private readonly _genderService: GenderService) {}

    @ApiOperation({
        summary: 'Generos',
        description: 'Genero de los usuarios (Masculino - Femenino)'
    })
    @ApiOkResponse({
        description: 'Muestra el detalle de los generos',
        type: GendersDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
    async genders(@Res() res:Response): Promise<void> {
        res.send(await this._genderService.genders());
    }

}
