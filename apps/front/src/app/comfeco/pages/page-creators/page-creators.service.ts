import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExhibitorsDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class PageCreatorsService {

  constructor(
    private http: HttpClient
  ) {}

  exhibitors() {
    return this.http.get<ExhibitorsDto>('/exhibitors').pipe(ValidatorService.changeBasicResponse());
  }
}
