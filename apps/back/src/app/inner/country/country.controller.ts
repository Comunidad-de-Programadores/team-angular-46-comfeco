import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CountrysDto, GenericResponse } from '@comfeco/interfaces';

import { CountryService } from './country.service';
import { AccessGuard } from '../../../config/guard/access.guard';

@ApiTags('Países')
@UseGuards(AccessGuard)
@Controller('countrys')
@ApiBearerAuth('access-token-service')
export class CountryController {

    constructor(private readonly _countryService: CountryService) {}

    @ApiOperation({
        summary: 'Países',
        description: 'Nombre del país y la bandera'
    })
    @ApiOkResponse({
        description: 'Muestra el nombre y la url de la imagen de la bandera',
        type: CountrysDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
    async countrys(@Res() res:Response): Promise<void> {
        res.send(await this._countryService.countrys());
    }
    
}
