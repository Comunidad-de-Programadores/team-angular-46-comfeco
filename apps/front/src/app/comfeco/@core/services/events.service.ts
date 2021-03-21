/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ValidatorService } from '@comfeco/validator';
import { EventDayDto, EventDto, EventsDayDto } from '@comfeco/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private _eventGlobal:EventDto;

  constructor(
    private http: HttpClient
  ) {}

  eventInfo() {
    if(this._eventGlobal) {
      return of(this._eventGlobal);
    }

    return this.http.get<EventDto>('/events')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._eventGlobal = resp;
          return resp;
        }));
  }

  allEvents() {
    return this.http.get<EventsDayDto>('/events_day').pipe(ValidatorService.changeBasicResponse());
  }

  userEvents() {
    return this.http.get<EventsDayDto>('/user/events').pipe(ValidatorService.changeBasicResponse());
  }

  participate(event:EventDayDto) {
    return this.http.post<EventsDayDto>('/user/add_event', event).pipe(ValidatorService.changeBasicResponse());
  }

  leave(event:EventDayDto) {
    return this.http.put<EventsDayDto>('/user/leave_event', event).pipe(ValidatorService.changeBasicResponse());
  }

  clean() {
    this._eventGlobal = undefined;
  }

}
