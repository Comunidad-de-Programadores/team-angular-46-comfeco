import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse, WorkshopsAreaDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class PageWorkshopsService {

  constructor(
    private http: HttpClient
  ) {}

  workshops() {
    return this.http.get<WorkshopsAreaDto | GenericResponse>('/workshops/all').pipe(ValidatorService.changeBasicResponse());
  }
  
}
