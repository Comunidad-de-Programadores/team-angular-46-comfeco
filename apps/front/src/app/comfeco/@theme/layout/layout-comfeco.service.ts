import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { TypeAlertNotification } from '../@components/alert-notification/alert-notification.enum';
import { AlertNotification } from '../@components/alert-notification/alert-notification.interface';
import { Modal } from '../@components/modal/modal.interface';

@Injectable({
  providedIn: 'root'
})
export class LayoutComfecoService {

  alertNotifications:AlertNotification[] = [];
  modals:Modal[] = [];
  idNotification = 0;
  idModal = 0;

  private alertNotificationSource = new BehaviorSubject<AlertNotification[]>([]);
  public alertNotification$ = this.alertNotificationSource.asObservable();
  private modalSource = new BehaviorSubject<Modal[]>([]);
  public modal$ = this.modalSource.asObservable();

  modalConfirm$:Subject<Modal> = new Subject();

  alertNotification(alert:AlertNotification) {
    this.idNotification++;
    const id:number = this.idNotification;
    const alertNew:AlertNotification = {
      message: alert.message,
      type: alert.type || TypeAlertNotification.ERROR,
      time: alert.time || 8000, id
    };

    this.alertNotifications.unshift(alertNew);
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

  modal(modal:Modal) {
    this.idModal++;
    const id:number = this.idModal;
    this.modals.push({...modal, id});
    this.modalSource.next(this.modals);
    return id;
  }

  deleteModal(modal:Modal) {
    this.modals.forEach((innerModal:Modal, index:number) => {
      if(innerModal.id===modal.id) {
        this.modalConfirm$.next(modal);
        this.modals.splice(index, 1);
        this.modalSource.next(this.modals);
      }
    });
  }

}
