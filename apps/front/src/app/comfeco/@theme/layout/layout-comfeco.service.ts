import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TypeAlertNotification } from '../@components/alert-notification/alert-notification.enum';
import { AlertNotification } from '../@components/alert-notification/alert-notification.interface';

@Injectable({
  providedIn: 'root'
})
export class LayoutComfecoService {

  alertNotifications:AlertNotification[] = [];
  idNotification:number = 0;

  private alertNotificationSource = new BehaviorSubject<AlertNotification[]>([]);
  public alertNotification$ = this.alertNotificationSource.asObservable();
  
  alertNotification(alert:AlertNotification) {
    this.idNotification++;
    const id:number = this.idNotification;
    const alertNew:AlertNotification = {
      message: alert.message,
      type: alert.type || TypeAlertNotification.ERROR,
      time: alert.time || 8000, id
    };

    this.alertNotifications.push(alertNew);
    this.alertNotificationSource.next(this.alertNotifications);

    this.deleteAlertNotificationExpired(id, alertNew.time);
  }

  deleteAlertNotificationExpired(id:number, time:number) {
    setTimeout(_ => {
      this.alertNotifications.forEach((alert:AlertNotification, index:number) => {
        if(alert.id===id) {
          this.alertNotifications.splice(index, 1);
          this.alertNotificationSource.next(this.alertNotifications);
        }
      });
    }, time+1000);
  }

}
