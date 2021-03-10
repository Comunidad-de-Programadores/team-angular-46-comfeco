import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TypeAlertNotification } from './alert-notification.enum';
import { AlertNotification } from './alert-notification.interface';

@Component({
  selector: 'comfeco-alert-notification',
  templateUrl: './alert-notification.component.html',
  styleUrls: ['./alert-notification.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertNotificationComponent implements OnInit {

  @Input() notification:AlertNotification;

  classNotification:string='alert-notification ';

  icon:string;
  section:string;
  show:string;

  ngOnInit(): void {
    this.show = this.classNotification+'alert-notification-show';

    if(this.notification.type === TypeAlertNotification.SUCCESS) {
      this.section = 'alert-notification-success';
      this.icon = 'icon-comfeco-check';
    } else {
      this.section = 'alert-notification-error';
      this.icon = 'icon-comfeco-times';
    }

    setTimeout(_ => {
      this.close();
    }, this.notification.time);
  }

  close() {
    const classHide = this.classNotification+'alert-notification-hidde';
    const classHiden = 'hidden';

    if(this.show!==classHide && this.show!==classHiden) {
      this.show = classHide;
      setTimeout(_ => { this.show = classHiden }, 1000);
    }
  }

}
