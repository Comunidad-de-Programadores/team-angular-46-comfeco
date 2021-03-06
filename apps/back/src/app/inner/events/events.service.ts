import { HttpStatus, Injectable } from '@nestjs/common';

import { EventDto, GenericResponse } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {

    constructor(private readonly _eventsRepository: EventsRepository) {}

    async event(): Promise<EventDto | GenericResponse> {
        const eventEntity:EventDto = await this._eventsRepository.event();
        
        if(eventEntity==null) {
            return UtilResponse.genericResponse('',['No hay información del evento en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        return eventEntity;
    }

}
