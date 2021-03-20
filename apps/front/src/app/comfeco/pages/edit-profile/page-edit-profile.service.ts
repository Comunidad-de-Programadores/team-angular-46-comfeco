import { Injectable } from '@angular/core';

import { UserChangeInformationDto } from '@comfeco/interfaces';
import { ProfileService } from '../../@core/services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class PageEditProfileService {

  constructor(
    private _profileService: ProfileService
  ) {}

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

    return this._profileService.changeInformation(formData);
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
