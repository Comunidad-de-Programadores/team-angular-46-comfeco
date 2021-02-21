import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GenericResponse, UserDto } from '@comfeco/interfaces';

import { UserGuard } from '../../config/guard/user.guard';
import { UserService } from './user.service';
import { ParameterToken } from '../../config/guard/user.decorator';

@ApiTags('Usuario')
@Controller('user')
@ApiBearerAuth('access-token-service')
export class UserController {

    constructor( private _userService: UserService ){}

    
    @ApiOperation({
        summary: 'Datos del usuario',
        description: 'Información del usuario para mostrar en el aplicativo'
    })
    @ApiOkResponse({
        description: 'Usuario encontrado',
        type: UserDto,
    })
    @ApiBadRequestResponse({
        description: "No se manda un token válido",
        type: GenericResponse,
    })
    @Get()
    @UseGuards(UserGuard)
	async information(@Res() res:Response, @ParameterToken('user') user:string): Promise<void> {
        const userInformation = await this._userService.information(user);

        res.status(userInformation.code).send(userInformation);
	}
    
}
