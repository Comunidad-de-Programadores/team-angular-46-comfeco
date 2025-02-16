import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiBadRequestResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

import { GenericResponse, MenuDto } from '@comfeco/interfaces';

import { MenuService } from './menu.service';
import { AccessGuard } from '../../../config/guard/access.guard';

@ApiTags('Menú')
@Controller('menu')
@UseGuards(AccessGuard)
@ApiBearerAuth('access-token-service')
export class MenuController {

    constructor(private readonly _service: MenuService) {}

    @ApiOperation({
        summary: 'Menú del aplicativo',
        description: 'El menú se despliega en un orden configurable por base de datos'
    })
    @ApiOkResponse({
        description: 'Opciones del menú',
        type: MenuDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
	async information(@Res() res:Response): Promise<void> {
        res.send(await this._service.menu());
	}
    
}
