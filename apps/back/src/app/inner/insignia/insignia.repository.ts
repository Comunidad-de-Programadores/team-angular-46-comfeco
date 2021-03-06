import { Injectable } from '@nestjs/common';

import { InsigniaDto } from '@comfeco/interfaces';

import { FirestoreRepository } from '../../../config/db/firestore.repository';

@Injectable()
export class InsigniaRepository {

    private _coleccion:string = 'insignia';

    constructor(private readonly db: FirestoreRepository) {}

    async insignias(): Promise<InsigniaDto[] | null> {
        const insigniasBase = await this.db.collection(this._coleccion).get();
        const insigniasDocuments = await this.db.returnDocuments(insigniasBase);

        if(insigniasDocuments.length==0) {
            return null;
        }

        let insignias: InsigniaDto[] = [];

        insigniasDocuments.forEach((insignia:any) => {
            insignias.push({
                name: insignia.name,
            });
        });

        return insignias;
    }

}
