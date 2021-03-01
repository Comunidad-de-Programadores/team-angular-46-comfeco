import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GenericResponse, MenuDto, UserDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  urlApp:string = environment.urlApi;

  constructor(
    private http: HttpClient
  ) {}

  optionsMenu() {
    const url:string = `${this.urlApp}/menu`;
    const headers:HttpHeaders = ValidatorService.authHeader();
    return this.http.get<MenuDto | GenericResponse>(url, { headers }).pipe(ValidatorService.changeBasicResponse());
  }

  user() {
    const url:string = `${this.urlApp}/user`;
    const headers:HttpHeaders = ValidatorService.authHeader();
    return this.http.get<UserDto | GenericResponse>(url, { headers }).pipe(ValidatorService.changeBasicResponse());
  }
  
}
