import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GenericResponse, MenuUserProfileDto } from '@comfeco/interfaces';

import { SubmenuUserProfileService } from './submenu-user-profile.service';
import { AccessGuard } from '../../../config/guard/access.guard';

@UseGuards(AccessGuard)
@ApiTags('Submenú de perfil de usuario')
@Controller('submenu-user-profile')
@ApiBearerAuth('access-token-service')
export class SubmenuUserProfileController {

    constructor(private readonly _submenuUserProfileService: SubmenuUserProfileService) {}
    
    @ApiOperation({
        summary: 'Menú del perfil del usuario',
        description: 'Menú secundario para poder visualizar y editar la información del perfil del usuario'
    })
    @ApiOkResponse({
        description: 'Opciones del menú del usuario',
        type: MenuUserProfileDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
	async sponsors(@Res() res:Response): Promise<void> {
        res.send(await this._submenuUserProfileService.submenu());
	}
    
}
