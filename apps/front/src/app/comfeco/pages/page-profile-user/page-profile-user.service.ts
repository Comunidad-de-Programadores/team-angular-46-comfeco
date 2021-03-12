import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto, InsigniasDto, EventsDayDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class PageProfileUserService {

  urlService:string = '/user';

  constructor(
    private http: HttpClient
  ) {}

  userInformation() {
    return this.http.get<UserDto>(`${this.urlService}/profile`).pipe(ValidatorService.changeBasicResponse());
  }

  allInsignias() {
    return this.http.get<InsigniasDto>('/insignias').pipe(ValidatorService.changeBasicResponse());
  }

  userInsignias() {
    return this.http.get<InsigniasDto>(`${this.urlService}/insignias`).pipe(ValidatorService.changeBasicResponse());
  }

  userEvents() {
    return this.http.get<EventsDayDto>(`${this.urlService}/events`).pipe(ValidatorService.changeBasicResponse());
  }

}
