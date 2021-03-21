/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { InsigniasDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class InsigniasService {

  private allInsignias:InsigniasDto;
  private allUserInsignias:InsigniasDto;

  constructor(
    private http: HttpClient
  ) {}

  insignias() {
    if(this.allInsignias) {
      return of(this.allInsignias);
    }

    return this.http.get<InsigniasDto>('/insignias')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this.allInsignias = resp;
          return resp;
        }));
  }

  userInsignias() {
    if(this.allUserInsignias) {
      return of(this.allUserInsignias);
    }

    return this.http.get<InsigniasDto>('/user/insignias')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this.allUserInsignias = resp;
          return resp;
        })
      );
  }

  clean() {
    this.allInsignias = undefined;
  }

}
