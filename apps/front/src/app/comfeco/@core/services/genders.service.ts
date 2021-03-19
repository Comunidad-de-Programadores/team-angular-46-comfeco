import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ValidatorService } from '@comfeco/validator';
import { GendersDto } from '@comfeco/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GendersService {

  private _allGenders:GendersDto;

  constructor(
    private http: HttpClient
  ) {}
  
  genders() {
    if(!!this._allGenders) {
      return of(this._allGenders);
    }

    return this.http.get<GendersDto>('/genders')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._allGenders = resp;
          return resp;
        }));
  }

  clean() {
    this._allGenders = undefined;
  }

}
