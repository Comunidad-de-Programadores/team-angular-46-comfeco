import { Injectable } from '@nestjs/common';

import { MenuOptionUserProfileDto } from '@comfeco/interfaces';

import { FirestoreRepository } from '../../../config/db/firestore.repository';

@Injectable()
export class SubmenuUserProfileRepository {

    private _coleccion:string = 'submenu_user_profile';

    constructor(private readonly db: FirestoreRepository) {}
    
    async submenu(): Promise<MenuOptionUserProfileDto[] | null> {
        const submenuBase = await this.db.collection(this._coleccion).orderBy('order').get();
        const submenuDocuments = await this.db.returnDocuments(submenuBase);

        if(submenuDocuments.length==0) {
            return null;
        }

        let submenu: MenuOptionUserProfileDto[] = [];
        
        submenuDocuments.forEach((opcion:any) => {
            submenu.push({
                component: opcion.component,
                option: opcion.option,
                order: opcion.order,
                icon: opcion.icon,
            });
        });
        
        return submenu;
    }

}
