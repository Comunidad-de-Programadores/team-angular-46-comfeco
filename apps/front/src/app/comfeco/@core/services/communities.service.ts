import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ValidatorService } from '@comfeco/validator';
import { CommunitiesDto } from '@comfeco/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommunitiesService {

  private _firstCommunities:CommunitiesDto;
  private _allCommunities:CommunitiesDto;

  constructor(
    private http: HttpClient
  ) {}
  
  firstCommunities() {
    if(!!this._firstCommunities) {
      return of(this._firstCommunities);
    }
    
    return this.http.get<CommunitiesDto>('/communities')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._firstCommunities = resp;
          return resp;
        }));
  }

  allCommunities() {
    if(!!this._allCommunities) {
      return of(this._allCommunities);
    }

    return this.http.get<CommunitiesDto>('/communities/all')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._allCommunities = resp;
          return resp;
        }));
  }

  clean() {
    this._firstCommunities = undefined;
    this._allCommunities = undefined;
  }

}
