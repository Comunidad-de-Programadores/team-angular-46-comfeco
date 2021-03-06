import { Injectable } from '@nestjs/common';

import { GenderDto } from '@comfeco/interfaces';

import { FirestoreRepository } from '../../../config/db/firestore.repository';

@Injectable()
export class GenderRepository {

    private _coleccion:string = 'gender';

    constructor(private readonly db: FirestoreRepository) {}
    
    async genders(): Promise<GenderDto[] | null> {
        const gendersBase = await this.db.collection(this._coleccion).get();
        const gendersDocuments = await this.db.returnDocuments(gendersBase);

        if(gendersDocuments.length==0) {
            return null;
        }

        let genders: GenderDto[] = [];

        gendersDocuments.forEach((gender:any) => {
            genders.push({
                id: gender.id,
                type: gender.type,
            });
        });

        return genders;
    }

}
