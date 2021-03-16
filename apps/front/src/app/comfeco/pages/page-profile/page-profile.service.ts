import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { EventDayDto, InsigniaDto, MenuUserProfileDto, UserDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class PageProfileService {

  userInformation$:Subject<UserDto> = new Subject();
  userInsignias$:Subject<InsigniaDto[]> = new Subject();
  addedEvent$:Subject<EventDayDto> = new Subject();
  deletedEvent$:Subject<EventDayDto> = new Subject();
  
  urlService:string = '/user';

  constructor(
    private http: HttpClient
  ) {}
  
  optionsMenu() {
    return this.http.get<MenuUserProfileDto>('/submenu-user-profile').pipe(ValidatorService.changeBasicResponse());
  }

  userInformation() {
    return this.http.get<UserDto>(`${this.urlService}/profile`).pipe(ValidatorService.changeBasicResponse());
  }

}
