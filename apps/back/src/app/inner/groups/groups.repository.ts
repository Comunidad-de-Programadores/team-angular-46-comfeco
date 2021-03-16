import { GroupDto } from '@comfeco/interfaces';
import { Injectable } from '@nestjs/common';
import { FirestoreRepository } from 'apps/back/src/config/db/firestore.repository';
import { UserEntity } from '../user/model/user.entity';

@Injectable()
export class GroupsRepository {

    private _coleccion:string = 'groups';

    constructor(private readonly db: FirestoreRepository) {}

    async groups(idUser:string): Promise<GroupDto[] | null> {
        const groupsBase = await this.db.collection(this._coleccion)
                    .where('active', '==', true)
                    .orderBy('order', 'asc').get();
        const groupsDocuments = await this.db.returnDocuments(groupsBase);

        if(groupsDocuments.length==0) {
            return null;
        }

        let groups: GroupDto[] = [];

        const groupUser:number = await this._groupUser(idUser);
        
        groupsDocuments.forEach((group:any) => {
            const { id, name, language, penality, description } = group;
            groups.push({
                id,
                name,
                language,
                penality,
                description,
                belong: groupUser!==0 && group.order==groupUser
            });
        });

        return groups;
    }

    async groupContainsName(idUser:string, name:string) {
        const groupsBase = await this.db.collection(this._coleccion)
                    .where('active', '==', true)
                    .where('keywords', 'array-contains', name)
                    .orderBy('name', 'asc')
                    .get();
        const groupsDocuments = await this.db.returnDocuments(groupsBase);

        if(groupsDocuments.length==0) {
        return null;
        }

        let groups: GroupDto[] = [];
        const groupUser:number = await this._groupUser(idUser);
        
        groupsDocuments.forEach((group:any) => {
            const { id, name, language, penality, description } = group;
            groups.push({
                id,
                name,
                language,
                penality,
                description,
                belong: groupUser!==0 && group.order==groupUser
            });
        });

        return groups;
    }

    async groupByLanguage(idUser:string, idLanguage:string): Promise<GroupDto[] | null> {
        const languageRef:any = await this.db.collection('technologies').doc(idLanguage);
        const groupBase = await this.db.collection(this._coleccion).where('language','==',languageRef).get();
        const groupsDocument = await this.db.returnDocuments(groupBase);

        if(groupsDocument.length==0) {
            return null;
        }

        let groups: GroupDto[] = [];

        const groupUser:number = await this._groupUser(idUser);
        
        groupsDocument.forEach((group:any) => {
            const { id, name, language, penality, description } = group;
            groups.push({
                id,
                name,
                language,
                penality,
                description,
                belong: groupUser!==0 && group.order==groupUser
            });
        });

        return groups;
    }

    private async _groupUser(idUser:string): Promise<number> {
        const baseUser = await this.db.collection('users').doc(idUser).get();
        const user:UserEntity = await this.db.returnInfoDocument(baseUser);
        return user?.group?.order || 0;
    }

}
