import { TechnologieDto } from '@comfeco/interfaces';
import { Injectable } from '@nestjs/common';
import { FirestoreRepository } from 'apps/back/src/config/db/firestore.repository';

@Injectable()
export class TechnologiesRepository {

    private _coleccion:string = 'technologies';

    constructor(private readonly db: FirestoreRepository) {}

    async technologies(): Promise<TechnologieDto[] | null> {
        const technologiesBase = await this.db.collection(this._coleccion).orderBy('name', 'asc').get();
        const technologiesDocuments = await this.db.returnDocuments(technologiesBase);

        if(technologiesDocuments.length==0) {
            return null;
        }

        let technologies: TechnologieDto[] = [];

        technologiesDocuments.forEach((technology:any) => {
            technologies.push(technology);
        });

        return technologies;
    }

}
