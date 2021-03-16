import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EventDayDto, EventsDayDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class PageEventsService {

  constructor(
    private http: HttpClient
  ) {}
  
  eventsData() {
    return this.http.get<EventsDayDto>('/events_day').pipe(ValidatorService.changeBasicResponse());
  }

  participate(event:EventDayDto) {
    return this.http.post<EventsDayDto>('/user/add_event', event).pipe(ValidatorService.changeBasicResponse());
  }

  leave(event:EventDayDto) {
    return this.http.put<EventsDayDto>('/user/leave_event', event).pipe(ValidatorService.changeBasicResponse());
  }

}
