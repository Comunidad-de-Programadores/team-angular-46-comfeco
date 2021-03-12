import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ageUser'
})
export class AgeUserPipe implements PipeTransform {

  transform(value: any):string {
    const age:number = !!value && this.ageUser(parseInt(value._seconds)*1000);
    
    return !!age && `${age} Años`;
  }

  ageUser(date:any) {
    var birthday = new Date(date);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}
