import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { InsigniasDto, EventsDayDto, RecentActivitiesDto, EventDayDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class PageProfileUserService {

  urlService:string = '/user';

  constructor(
    private http: HttpClient
  ) {}

  allInsignias() {
    return this.http.get<InsigniasDto>('/insignias').pipe(ValidatorService.changeBasicResponse());
  }

  userInsignias() {
    return this.http.get<InsigniasDto>(`${this.urlService}/insignias`).pipe(ValidatorService.changeBasicResponse());
  }

  userEvents() {
    return this.http.get<EventsDayDto>(`${this.urlService}/events`).pipe(ValidatorService.changeBasicResponse());
  }

  leave(event:EventDayDto) {
    return this.http.put<EventsDayDto>('/user/leave_event', event).pipe(ValidatorService.changeBasicResponse());
  }
  
  recentActivity() {
    return this.http.get<RecentActivitiesDto>(`${this.urlService}/recent_activity`).pipe(ValidatorService.changeBasicResponse());
  }

}
