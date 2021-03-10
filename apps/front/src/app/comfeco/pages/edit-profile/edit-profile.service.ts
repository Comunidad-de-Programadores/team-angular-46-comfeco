import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AreasDto, CountrysDto, GendersDto, UserChangeInformationDto, UserDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {

  constructor(
    private http: HttpClient
  ) {}

  knowledgeArea() {
    return this.http.get<AreasDto>('/knowledge_area').pipe(ValidatorService.changeBasicResponse());
  }

  genders() {
    return this.http.get<GendersDto>('/genders').pipe(ValidatorService.changeBasicResponse());
  }

  countrys() {
    return this.http.get<CountrysDto>('/countrys').pipe(ValidatorService.changeBasicResponse());
  }

  userInformation() {
    return this.http.get<UserDto>('/user/profile').pipe(ValidatorService.changeBasicResponse());
  }

  editProfile(information:UserChangeInformationDto, file:any) {
    const birdthDate:string = !!information.birdth_date ? this.toTimestamp(information.birdth_date) : '';
    const socialNetworks:string = !!information.social_networks ? JSON.stringify(information.social_networks) : '';
    const specialities:string = !!information.specialities ? JSON.stringify(information.specialities) : '';
    const country:string = !!information.country && !!information.country.flag ? JSON.stringify(information.country) : '';
    
    const user = information.user || '';
    const email = information.email || '';
    const gender = information.gender || '';
    const password = information.password || '';
    const password_new = information.password_new || '';
    const description = information.description || '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', user);
    formData.append('email', email);
    formData.append('gender', gender);
    formData.append('password', password);
    formData.append('password_new', password_new);
    formData.append('description', description);
    formData.append('specialities', specialities);
    formData.append('birdth_date', birdthDate);
    formData.append('country', country);
    formData.append('social_networks', socialNetworks);

    return this.http.put<UserDto>('/user/change_information', formData).pipe(ValidatorService.changeBasicResponse());
  }

  toTimestamp(data:Date) {
    if(!!data) {
      const date:any = data;
      const datePart:string[] = date.split('-');
      let dateTemp= new Date();
      dateTemp.setFullYear(parseInt(datePart[0]));
      dateTemp.setDate(parseInt(datePart[2]));
      dateTemp.setMonth(parseInt(datePart[1])-1);
      dateTemp.setHours(1, 0, 0);

      return dateTemp.getTime().toString();
    }

    return '';
  }

  parseDate(date:string) {
      return !!date && date.split('-').reverse().join("/");
  }

  formatDate(date:any) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

}
