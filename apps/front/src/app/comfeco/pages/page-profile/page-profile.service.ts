import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuUserProfileDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class PageProfileService {

  constructor(
    private http: HttpClient
  ) {}
  
  optionsMenu() {
    return this.http.get<MenuUserProfileDto>('/submenu-user-profile').pipe(ValidatorService.changeBasicResponse());
  }

}
