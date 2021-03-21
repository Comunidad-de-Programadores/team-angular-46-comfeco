/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ageUser'
})
export class AgeUserPipe implements PipeTransform {

  transform(value: any):string {
    const age:number = !!value && this.ageUser(parseInt(value._seconds)*1000);

    if(!age) return '';

    return !!age && `${age} Años`;
  }

  ageUser(date:any) {
    const birthday = new Date(date);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}
