import { HttpStatus, Injectable } from '@nestjs/common';

import { EventDto } from '@comfeco/interfaces';

import { FirestoreRepository } from '../../../config/db/firestore.repository';

@Injectable()
export class EventsRepository {

    private _coleccion:string = 'events';

    constructor(private readonly db: FirestoreRepository) {}
    
    async event(): Promise<EventDto | null> {
        const eventBase = await this.db.collection(this._coleccion)
                .orderBy('dateEvent', 'desc')
                .limit(1)
                .get();
        const eventDocuments = await this.db.returnDocuments(eventBase);

        if(eventDocuments.length==0) {
            return null;
        }
        
        const { welcome, subtitule, description, dateEvent  } = eventDocuments[0];
        const event: EventDto = {
            code: HttpStatus.OK,
            welcome,
            subtitule,
            description,
            dateEvent: this.db.timestampToDate(dateEvent._seconds)
        }

        return event;
    }

}
