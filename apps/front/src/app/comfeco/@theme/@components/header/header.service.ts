import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { GenericResponse, MenuDto, UserDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private userSource = new BehaviorSubject<string>('');
  private photoUrlSource = new BehaviorSubject<string>('');

  public user$ = this.userSource.asObservable();
  public photoUrl$ = this.photoUrlSource.asObservable();
  
  constructor(
    private http: HttpClient
  ) {}

  optionsMenu() {
    return this.http.get<MenuDto>('/menu').pipe(ValidatorService.changeBasicResponse());
  }

  user() {
    return this.http.get<UserDto>('/user').pipe(ValidatorService.changeBasicResponse());
  }

  logout() {
    return this.http.get<GenericResponse>('/auth/logout').pipe(ValidatorService.changeBasicResponse());
  }

  changeUser(user:string) {
    this.userSource.next(user);
  }

  changePhoto(photoUrl:string) {
    this.photoUrlSource.next(photoUrl);
  }
  
}
