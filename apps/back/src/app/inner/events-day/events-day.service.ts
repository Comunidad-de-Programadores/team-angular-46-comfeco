import { HttpStatus, Injectable } from '@nestjs/common';

import { EventDayDto, EventsDayDto, GenericResponse } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { EventsDayRepository } from './events-day.repository';

@Injectable()
export class EventsDayService {

    constructor(private readonly _eventsDayRepository: EventsDayRepository) {}

    async events(): Promise<EventsDayDto | GenericResponse> {
        const eventsEntity:EventDayDto[] = await this._eventsDayRepository.events();
        
        if(eventsEntity==null) {
            return UtilResponse.genericResponse('',['No hay eventos en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        const events:EventsDayDto = {
            code: HttpStatus.OK,
            events: eventsEntity
        }

        return events;
    }

}
