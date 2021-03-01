import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { AreasDto, CommunitiesDto, DayEvent, EventDto, GenericResponse, WorkshopsAreaDto } from '@comfeco/interfaces';
import { ValidatorService } from '@comfeco/validator';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  urlApp:string = environment.urlApi;

  constructor(
    private http: HttpClient
  ) {}

  communities() {
    const url:string = `${this.urlApp}/communities`;
    const headers:HttpHeaders = ValidatorService.authHeader();
    return this.http.get<CommunitiesDto | GenericResponse>(url, { headers }).pipe(ValidatorService.changeBasicResponse());
  }

  knowledgeArea() {
    const url:string = `${this.urlApp}/knowledge_area`;
    const headers:HttpHeaders = ValidatorService.authHeader();
    return this.http.get<AreasDto | GenericResponse>(url, { headers }).pipe(ValidatorService.changeBasicResponse());
  }

  workshops(idArea:string) {
    if(!idArea) {
      idArea = '0';
    }

    const url:string = `${this.urlApp}/workshops_area/${idArea}`;
    const headers:HttpHeaders = ValidatorService.authHeader();
    return this.http.get<WorkshopsAreaDto | GenericResponse>(url, { headers }).pipe(ValidatorService.changeBasicResponse());
  }

  eventInfo() {
    const url:string = `${this.urlApp}/events`;
    const headers:HttpHeaders = ValidatorService.authHeader();
    return this.http.get<EventDto | GenericResponse>(url, { headers }).pipe(ValidatorService.changeBasicResponse());
  }

  countdownTimer(dateEvent:Date) {
    let dayEvent:DayEvent = this._convertDate(dateEvent);

    return timer(0, 1000)
      .pipe(
        map( _ => {
          const { days, hours, minutes, seconds, timeOut } = dayEvent;
          let timeOutNew = timeOut;
          let minutesNew = minutes;
          let hoursNew = hours;
          let daysNew = days;
          let secondsNew = seconds;

          if(secondsNew===0) {
            secondsNew = 59;

            minutesNew = this._evaluateChangeTime(minutesNew, 59, hoursNew);

            if(minutesNew===59) {
              hoursNew = this._evaluateChangeTime(hoursNew, 23, daysNew);
            }

            if(hoursNew===23) {
              daysNew = this._evaluateChangeTime(daysNew, 0, 0);
            }

            if(daysNew===0) {
              hoursNew = this._evaluateChangeTime(hoursNew, 23, daysNew);
              minutesNew = this._evaluateChangeTime(minutesNew, 59, hoursNew);
            }

          } else {
            secondsNew--;
          }

          if(daysNew===0 && hoursNew===0 && minutesNew===0 && secondsNew===0) {
            timeOutNew = true;
          }

          dayEvent = {
            timeOut: timeOutNew,
            days: daysNew,
            hours: hoursNew,
            minutes: minutesNew,
            seconds: secondsNew
          }

          return dayEvent;
        }
      )
    );
  }

  private _evaluateChangeTime(time:number, reset:number, predecessor:number) {
    let timeNew:number;

    if(time-1!==-1) {
      timeNew = time-1;
    } else if(predecessor!==0) {
      timeNew = reset;
    } else {
      timeNew = predecessor;
    }

    return timeNew;
  }

  private _convertDate(eventDay): DayEvent {
    let delta = Math.abs(eventDay.getTime() - new Date().getTime()) / 1000;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = Math.floor(delta % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
      timeOut: false
    };
  }

}
