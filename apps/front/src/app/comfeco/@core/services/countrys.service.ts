import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ValidatorService } from '@comfeco/validator';
import { CountrysDto } from '@comfeco/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountrysService {

  private _allCountrys:CountrysDto;

  constructor(
    private http: HttpClient
  ) {}
  
  countrys() {
    if(!!this._allCountrys) {
      return of(this._allCountrys);
    }

    return this.http.get<CountrysDto>('/countrys')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._allCountrys = resp;
          return resp;
        }));
  }

  clean() {
    this._allCountrys = undefined;
  }

}
