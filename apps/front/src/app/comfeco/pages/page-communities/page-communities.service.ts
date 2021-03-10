import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunitiesDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class PageCommunitiesService {

  constructor(
    private http: HttpClient
  ) {}

  communities() {
    return this.http.get<CommunitiesDto>('/communities/all').pipe(ValidatorService.changeBasicResponse());
  }
  
}
