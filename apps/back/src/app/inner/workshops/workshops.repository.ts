import { Injectable } from '@nestjs/common';

import { AreaWorkshopDto, KnowledgeAreaDto, WorkshopAreaDto } from '@comfeco/interfaces';

import { FirestoreRepository } from '../../../config/db/firestore.repository';

@Injectable()
export class WorkshopsRepository {

    private _coleccionWorkshops:string = 'workshops';
    private _coleccionArea:string = 'knowledge_area';

    constructor(private readonly db: FirestoreRepository) {}
    
    async sysdate(): Promise<FirebaseFirestore.Timestamp> {
        return await this.db.now();
    }

    async knowledgeArea(): Promise<KnowledgeAreaDto[] | null> {
        const knowledgesBase = await this.db.collection(this._coleccionArea)
                    .orderBy('area', 'asc').get();
        const knowledgesDocuments = await this.db.returnDocuments(knowledgesBase);

        if(knowledgesDocuments.length===0) return null;

        let knowledges: KnowledgeAreaDto[] = [];

        knowledgesDocuments.forEach((knowledge:any) => {
            const { id, area } = knowledge;
            knowledges.push({ id, area });
        });

        return knowledges;
    }

    async workshopsToday(area:string): Promise<AreaWorkshopDto[] | null> {
        const [ start ] = await this.db.todaysRank();
        const areaReferences = await this.db.collection(this._coleccionArea).doc(area);
        const workshopsBase = await this.db.collection(this._coleccionWorkshops)
                    //.where('startTime', '>=', start)
                    .where('area', '==', areaReferences)
                    .orderBy('startTime', 'desc')
                    .orderBy('author', 'asc')
                    .get();
        
        return this._collectionFiltering(workshopsBase);
    }

    async workshopsAll(): Promise<AreaWorkshopDto[] | null> {
        const workshopsBase = await this.db.collection(this._coleccionWorkshops)
                .orderBy('area', 'asc')
                .orderBy('startTime', 'asc')
                .orderBy('author', 'asc')
                .get();
        
        return this._collectionFiltering(workshopsBase);
    }

    private async _collectionFiltering(workshopsBase:any): Promise<AreaWorkshopDto[] | null> {
        const workshopsDocuments = await this.db.returnDocuments(workshopsBase);

        if(workshopsDocuments.length===0) return null;

        return workshopsDocuments.reduce(
            (result:AreaWorkshopDto[], currentValue:any) => {
                const {
                    author,
                    startTime:startTimeDB,
                    endTime:endTimeDB,
                    urlSocialNetwork,
                    urlWorkshop,
                    topic, description
                } = currentValue;

                const startTime:Date = this.db.timestampToDate(startTimeDB._seconds);
                const endTime:Date = this.db.timestampToDate(endTimeDB._seconds);
                const key:string = 'area';

                const isKeyArea = (value:any) => value.area === currentValue[key];
                const indexArea = result.length!==0
                    ? result.findIndex(isKeyArea)
                    : -1;

                const dataWorkshop:WorkshopAreaDto = {
                    author, startTime,
                    endTime, urlSocialNetwork,
                    urlWorkshop, topic,
                    description
                };

                if(indexArea===-1) {
                    result.push({
                        area: currentValue[key],
                        workshops: [dataWorkshop]
                    });
                } else {
                    result[indexArea].workshops.push(dataWorkshop);
                }

                return result;
            }, [],
        );
    }

}
