import { CommunityDto } from '@comfeco/interfaces';
import { Injectable } from '@nestjs/common';
import { FirestoreRepository } from '../../config/db/firestore.repository';

@Injectable()
export class CommunitiesRepository {

    private _coleccion:string = 'communities';

    constructor(private readonly db: FirestoreRepository) {}

    async communitiesFirstThree(): Promise<CommunityDto[] | null> {
        const communitiesBase = await this.db.collection(this._coleccion)
                    .orderBy('order', 'asc')
                    .limit(3)
                    .get();

        return this._collectionFiltering(communitiesBase);
    }
    
    async communitiesAll(): Promise<CommunityDto[] | null> {
        const communitiesBase = await this.db.collection(this._coleccion)
                    .orderBy('order', 'asc')
                    .get();

        return this._collectionFiltering(communitiesBase);
    }
    
    private async _collectionFiltering(communitiesBase:any) {
        const communitiesDocuments = await this.db.returnDocuments(communitiesBase);

        if(communitiesDocuments===null) {
            return null;
        }

        let communities: CommunityDto[] = [];

        communitiesDocuments.forEach((community:any) => {
            communities.push({
                order: community.order,
                name: community.name,
                link: community.link
            });
        });

        return communities;
    }

}
