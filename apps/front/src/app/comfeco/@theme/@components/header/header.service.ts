import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GenericResponse, MenuDto, UserDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(
    private http: HttpClient
  ) {}

  optionsMenu() {
    return this.http.get<MenuDto | GenericResponse>('/menu').pipe(ValidatorService.changeBasicResponse());
  }

  user() {
    return this.http.get<UserDto | GenericResponse>('/user').pipe(ValidatorService.changeBasicResponse());
  }

  logout() {
    return this.http.get<GenericResponse>('/auth/logout').pipe(ValidatorService.changeBasicResponse());
  }
  
}
