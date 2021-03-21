/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ValidatorService } from '@comfeco/validator';
import { AreasDto } from '@comfeco/interfaces';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeAreaService {

  private _allKnowledgeArea:AreasDto;

  constructor(
    private http: HttpClient
  ) {}

  knowledgeArea() {
    if(this._allKnowledgeArea) {
      return of(this._allKnowledgeArea);
    }

    return this.http.get<AreasDto>('/knowledge_area')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._allKnowledgeArea = resp;
          return resp;
        }));
  }

  clean() {
    this._allKnowledgeArea = undefined;
  }

}
