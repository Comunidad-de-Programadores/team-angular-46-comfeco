import { Injectable } from '@nestjs/common';

import { ExhibitorDto, Status, TechnologieDto } from '@comfeco/interfaces';

import { FirestoreRepository } from '../../../config/db/firestore.repository';

@Injectable()
export class ExhibitorsRepository {

    private _coleccion:string = 'exhibitors';

    constructor(private readonly db: FirestoreRepository) {}

    async exhibitors(): Promise<ExhibitorDto[] | null> {
        const statusReferences = await this.db.referenceDocumentKey('status_account', 'status', Status.ACTIVE);
        const exhibitorsBase = await this.db.collection(this._coleccion).where('status', '==', statusReferences).get();
        const exhibitorsDocuments = await this.db.returnDocuments(exhibitorsBase);

        if(exhibitorsDocuments.length==0) {
            return null;
        }

        let exhibitors: ExhibitorDto[] = [];

        exhibitorsDocuments.forEach((exhibitor:any) => {
            let technologies:TechnologieDto[] = [];
            
            exhibitor.technologies?.forEach((technologie:any)=>{
                technologies.push({
                    name: technologie.name,
                    photoUrl: technologie.photoUrl
                });
            });
            
            exhibitors.push({
                technologies : technologies,
                name: exhibitor.name,
                photoUrl: exhibitor.photoUrl
            });
        });

        return exhibitors;
    }

}
