import { HttpStatus, Injectable } from '@nestjs/common';

import { EventDayDto, EventsDayDto, GenericResponse } from '@comfeco/interfaces';
import { UtilResponse } from '@comfeco/validator';

import { EventsDayRepository } from './events-day.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class EventsDayService {

    constructor(
        private readonly _eventsDayRepository: EventsDayRepository,
        private readonly _userRepository: UserRepository
    ) {}

    async events(id:string): Promise<EventsDayDto | GenericResponse> {
        let eventsEntity:EventDayDto[] = await this._eventsDayRepository.events();
        
        if(eventsEntity==null) {
            return UtilResponse.genericResponse('',['No hay eventos en la base de datos'], HttpStatus.NOT_FOUND);
        }
        
        const baseEventsUser = await this._userRepository.allEvents(id);
        
        if(!!baseEventsUser) {
            let newEvents:EventDayDto[] = [];
            
            for(let i=0; i<eventsEntity.length; i++) {
                let newEvent:EventDayDto;
                for(let j=0; j<baseEventsUser.length; j++) {
                    if(eventsEntity[i].name === baseEventsUser[j].event.name) {
                        newEvent = {
                            ...eventsEntity[i],
                            participating : true,
                            date_aborted: baseEventsUser[j].date_aborted
                        }
                    }
                }

                if(!newEvent) {
                    newEvent = {
                        ...eventsEntity[i],
                        participating : false
                    };
                }

                newEvents.push(newEvent);
            }

            eventsEntity = newEvents;
        }

        const events:EventsDayDto = {
            code: HttpStatus.OK,
            events: eventsEntity
        }

        return events;
    }

}
