import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { InsigniasDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class PageInsigniasService {

  constructor(
    private http: HttpClient
  ) {}
  
  insignias() {
    return this.http.get<InsigniasDto>('/insignias').pipe(ValidatorService.changeBasicResponse());
  }

}
