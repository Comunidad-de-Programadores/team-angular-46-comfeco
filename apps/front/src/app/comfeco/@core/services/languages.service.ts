import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ValidatorService } from '@comfeco/validator';
import { TechnologiesDto } from '@comfeco/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  private _allLanguages:TechnologiesDto;

  constructor(
    private http: HttpClient
  ) {}
  
  languages() {
    if(!!this._allLanguages) {
      return of(this._allLanguages);
    }

    return this.http.get<TechnologiesDto>('/technologies')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._allLanguages = resp;
          return resp;
        }));
  }

  clean() {
    this._allLanguages = undefined;
  }

}
