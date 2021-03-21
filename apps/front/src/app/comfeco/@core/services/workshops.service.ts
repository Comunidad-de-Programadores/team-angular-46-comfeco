/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ValidatorService } from '@comfeco/validator';
import { WorkshopsAreaDto } from '@comfeco/interfaces';

@Injectable({
  providedIn: 'root'
})
export class WorkshopsService {

  private _allWorkshops:WorkshopsAreaDto;
  private _workshopsByArea:WorkshopsAreaDto[] = [];
  private _indexWorkshopsByArea:string[] = [];

  constructor(
    private http: HttpClient
  ) {}

  workshops() {
    if(this._allWorkshops) {
      return of(this._allWorkshops);
    }

    return this.http.get<WorkshopsAreaDto>('/workshops/all')
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._allWorkshops = resp;
          return resp;
        }));
  }

  workshopsByArea(idArea:string) {
    if(!idArea) {
      idArea = '0';
    }

    if(!!this._workshopsByArea && this._indexWorkshopsByArea.includes(idArea)) {
      const index:number = (this._indexWorkshopsByArea.findIndex(item => item===idArea));
      return of(this._workshopsByArea[index]);
    }

    const url = `/workshops_area/${idArea}`;
    return this.http.get<WorkshopsAreaDto>(url)
      .pipe(
        ValidatorService.changeBasicResponse(),
        tap((resp:any) => {
          this._workshopsByArea.push(resp);
          this._indexWorkshopsByArea.push(idArea);
          return resp;
        })
      );
  }

  clean() {
    this._allWorkshops = undefined;
    this._workshopsByArea = [];
    this._indexWorkshopsByArea = [];
  }

}
