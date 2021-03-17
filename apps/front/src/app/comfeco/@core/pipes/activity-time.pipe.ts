import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activityTime'
})
export class ActivityTimePipe implements PipeTransform {

  transform(value: any):string {
    const time:string = !!value && this.diff(parseInt(value._seconds)*1000);
    
    return !!time && `Hace ${time}`;
  }

  diff(date:any) {
    const dateNow:Date = new Date();
    const activity = new Date(date);
    const diffSeconds = (dateNow.getTime() - activity.getTime()) / 1000;

    if(diffSeconds<60) {
      const resultSeconds = Math.abs(Math.round(diffSeconds));
      return `${resultSeconds} Segundos`;
    }
    
    const diffMinutes = diffSeconds / 60;
    const resultMinutes = Math.abs(Math.round(diffMinutes));
    return `${resultMinutes} Minutos`;
  }

}
