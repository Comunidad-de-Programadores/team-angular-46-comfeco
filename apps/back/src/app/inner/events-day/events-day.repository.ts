import { Injectable } from '@nestjs/common';

import { EventDayDto } from '@comfeco/interfaces';

import { FirestoreRepository } from '../../../config/db/firestore.repository';

@Injectable()
export class EventsDayRepository {

    private _coleccion:string = 'events_day';

    constructor(private readonly db: FirestoreRepository) {}
    
    async events(): Promise<EventDayDto[] | null> {
        const eventsBase = await this.db.collection(this._coleccion).orderBy('order', 'asc').get();
        const eventsDocuments = await this.db.returnDocuments(eventsBase);

        if(eventsDocuments.length==0) {
            return null;
        }

        let events: EventDayDto[] = [];
        eventsDocuments.forEach((event:any) => {
            events.push({
                image: event.image,
                name: event.name,
                description: event.description,
                id: event.id
            });
        });
        
        return events;
    }

}
