import { HttpStatus, Injectable } from '@nestjs/common';

import { GenericResponse, MenuOptionUserProfileDto, MenuUserProfileDto } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { SubmenuUserProfileRepository } from './submenu-user-profile.repository';

@Injectable()
export class SubmenuUserProfileService {

    constructor(private readonly _submenuUserProfileRepository: SubmenuUserProfileRepository) {}

    async submenu(): Promise<MenuUserProfileDto | GenericResponse> {
        const submenuEntity:MenuOptionUserProfileDto[] = await this._submenuUserProfileRepository.submenu();
        
        if(submenuEntity==null) {
            return UtilResponse.genericResponse('',['No hay opciones de menú para el usuario en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        const submenu:MenuUserProfileDto = {
            code: HttpStatus.OK,
            options: submenuEntity
        }

        return submenu;
    }

}
