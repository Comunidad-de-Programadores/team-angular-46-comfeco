import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { EventDayDto, InsigniaDto, UserDto } from '@comfeco/interfaces';

import { ProfileService } from '../../@core/services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class PageTabsProfileService {

  userInformation$:Subject<UserDto> = new Subject();
  userInsignias$:Subject<InsigniaDto[]> = new Subject();
  addedEvent$:Subject<EventDayDto> = new Subject();
  deletedEvent$:Subject<EventDayDto> = new Subject();
  
  constructor(
    private _profileService: ProfileService
  ) {}
  
  userInformation() {
    return this._profileService.userInformation();
  }

}
