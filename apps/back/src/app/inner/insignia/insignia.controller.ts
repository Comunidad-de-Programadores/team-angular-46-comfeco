import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GenericResponse, InsigniasDto } from '@comfeco/interfaces';

import { InsigniaService } from './insignia.service';
import { AccessGuard } from '../../../config/guard/access.guard';

@ApiTags('Insignias')
@UseGuards(AccessGuard)
@Controller('insignias')
@ApiBearerAuth('access-token-service')
export class InsigniaController {

    constructor(private readonly _insigniaService: InsigniaService) {}

    @ApiOperation({
        summary: 'Insignias que se pueden obtener',
        description: 'Insignias a obtener en el evento'
    })
    @ApiOkResponse({
        description: 'Detalle de las insignias',
        type: InsigniasDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
	async insignias(@Res() res:Response): Promise<void> {
        res.send(await this._insigniaService.insignias());
	}
    
}
