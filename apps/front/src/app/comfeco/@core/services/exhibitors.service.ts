import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ValidatorService } from '@comfeco/validator';
import { ExhibitorsDto } from '@comfeco/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ExhibitorsService {

  private _allExhibitors:ExhibitorsDto;

  constructor(
    private http: HttpClient
  ) {}

  exhibitors() {
    if(this._allExhibitors) {
      return of(this._allExhibitors);
    }

    return this.http.get<ExhibitorsDto>('/exhibitors')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._allExhibitors = resp;
          return resp;
        }));
  }

  clean() {
    this._allExhibitors = undefined;
  }

}
