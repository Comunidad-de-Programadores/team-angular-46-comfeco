import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RecentActivitiesDto, UserDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient
  ) {}
  
  recentActivity() {
    return this.http.get<RecentActivitiesDto>('/user/recent_activity').pipe(ValidatorService.changeBasicResponse());
  }
  
  changeInformation(formData: FormData) {
    return this.http.put<UserDto>('/user/change_information', formData).pipe(ValidatorService.changeBasicResponse());
  }

  userInformation() {
    return this.http.get<UserDto>('/user/profile').pipe(ValidatorService.changeBasicResponse());
  }

}
