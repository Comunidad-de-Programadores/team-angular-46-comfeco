import { GenericResponse, MenuDto, MenuOptionDto } from '@comfeco/interfaces';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UtilResponse } from 'libs/validator/src/lib/respuestas.util';
import { MenuRepository } from './menu.respository';

@Injectable()
export class MenuService {
    
    constructor(private readonly _menuRepository: MenuRepository) {}

    async menu(): Promise<MenuDto | GenericResponse> {
        const menuEntity = await this._menuRepository.menu();
        
        if(menuEntity==null) {
            return UtilResponse.genericResponse('',['No hay información del menú en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        let options: MenuOptionDto[] = [];
        
        menuEntity.forEach((optionMenu:any) => {
            const {link, option, order} = optionMenu;
            options.push({link, option, order});
        });
        
        const menu:MenuDto = {
            code: HttpStatus.OK,
            options
        }

        return menu;
    }

}
