import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ValidatorService } from '@comfeco/validator';
import { SponsorsDto } from '@comfeco/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SponsorsService {

  private _allSponsors:SponsorsDto;

  constructor(
    private http: HttpClient
  ) {}
  
  sponsors() {
    if(!!this._allSponsors) {
      return of(this._allSponsors);
    }

    return this.http.get<SponsorsDto>('/sponsors')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._allSponsors = resp;
          return resp;
        }));
  }

  clean() {
    this._allSponsors = undefined;
  }

}
