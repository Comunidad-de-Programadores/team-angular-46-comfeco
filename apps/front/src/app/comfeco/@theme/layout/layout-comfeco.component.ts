import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertNotification } from '../@components/alert-notification/alert-notification.interface';
import { LayoutComfecoService } from './layout-comfeco.service';

@Component({
  selector: 'comfeco-layout',
  templateUrl: './layout-comfeco.component.html',
  styleUrls: ['./layout-comfeco.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LayoutComfecoComponent implements OnInit, AfterViewInit, OnDestroy {

  alertsNotification:AlertNotification[];

  private alertNotificationRef$:Subscription = null;
  
  constructor(
    private elementRef: ElementRef,
    public service: LayoutComfecoService
  ) {}

  ngOnInit(): void {
    this.alertNotificationRef$ = this.service.alertNotification$.subscribe((resp:AlertNotification[]) => {
      this.alertsNotification = resp;
    });
  }

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#ECECFF';
  }

  ngOnDestroy(): void {
    this.alertNotificationRef$.unsubscribe();
  }

}
