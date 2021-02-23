import { Injectable } from '@nestjs/common';

import { SponsorDto, Status } from '@comfeco/interfaces';

import { FirestoreRepository } from '../../config/db/firestore.repository';

@Injectable()
export class SponsorsRepository {

    private _coleccion:string = 'sponsors';

    constructor(private readonly db: FirestoreRepository) {}
    
    async sponsors(): Promise<SponsorDto[] | null> {
        const statusReferences = await this.db.referenceDocumentKey('status_account', 'status', Status.ACTIVE);
        const sponsorsBase = await this.db.collection(this._coleccion).where('status', '==', statusReferences).get();
        const sponsorsDocuments = await this.db.returnDocuments(sponsorsBase);

        if(sponsorsDocuments.length==0) {
            return null;
        }

        let sponsors: SponsorDto[] = [];

        sponsorsDocuments.forEach((sponsor:any) => {
            sponsors.push({
                name: sponsor.name,
                photoUrl: sponsor.photoUrl,
                order: sponsor.order,
            });
        });

        return sponsors;
    }

}
