import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { GenericResponse } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  urlAuth:string = '/auth';

  isActiveRefreshTokenTimeout:boolean = false;

  private refreshTokenTimeout;

  constructor(
    private http: HttpClient,
  ) {}

  logout() {
    return this.http.get<GenericResponse>('/auth/logout').pipe(
        ValidatorService.changeBasicResponse(),
        tap(resp => {
          if(resp.success) {
            this._stopRefreshTokenTimer();
          }

          return resp;
        })
      );
  }

  refreshToken() {
    const url:string = `${this.urlAuth}/refresh_token`;
    return this.http.get<GenericResponse>(url).pipe(
        ValidatorService.changeBasicResponse(),
        tap(resp => {
          if(resp.success) {
            this.startRefreshTokenTimer();
          } else {
            this._stopRefreshTokenTimer();
          }
        })
    );
  }

  startRefreshTokenTimer() {
    const miliseconds = 14 * 60 * 1000;
    this.isActiveRefreshTokenTimeout = true;
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), miliseconds);
  }

  private _stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
    this.isActiveRefreshTokenTimeout = false;
    localStorage.clear();
  }

}
