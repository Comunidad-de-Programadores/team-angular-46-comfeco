import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { EventDayDto } from '@comfeco/interfaces';

import { TypeAlertNotification } from '../../@theme/@components/alert-notification/alert-notification.enum';
import { InsigniaType } from '../../@theme/@components/insignia/insignia.enum';
import { InsigniaService } from '../../@theme/@components/insignia/insignia.service';
import { Modal } from '../../@theme/@components/modal/modal.interface';
import { SpinnerService } from '../../@theme/@components/spinner/spinner.service';
import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';
import { PageProfileService } from '../page-profile/page-profile.service';
import { PageEventsService } from './page-events.service';

@Component({
  selector: 'comfeco-page-events',
  templateUrl: './page-events.component.html',
  styleUrls: ['./page-events.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageEventsComponent implements OnInit, OnDestroy {

  events$:Subject<EventDayDto[]> = new Subject();
  eventSelected:EventDayDto;
  events:EventDayDto[];
  idModal:number;

  modalSubscription$:Subscription;
  eventsSubscription$:Subscription;
  addedEventUserSubscription$:Subscription;
  deletedEventUserSubscription$:Subscription;

  constructor(
    private _serviceProfile: PageProfileService,
    private _service: PageEventsService,
    private spinner: SpinnerService,
    private notification: LayoutComfecoService,
    private insignia:InsigniaService
  ) {}

  ngOnInit(): void {
    this.subscriptionEvents();
    this.subscriptionUserEvents();
    this.completeEvents();
    this.subscribeModalConfirm();
  }
  
  ngOnDestroy() {
    this.modalSubscription$.unsubscribe();
    this.eventsSubscription$.unsubscribe();
    this.addedEventUserSubscription$.unsubscribe();
    this.deletedEventUserSubscription$.unsubscribe();
  }

  subscriptionEvents() {
    this.eventsSubscription$ = this.events$.subscribe(eventsChanged => {
      this.events = eventsChanged;
    });
  }

  subscriptionUserEvents() {
    this.addedEventUserSubscription$ = this._serviceProfile.addedEvent$.subscribe(event => {
      this.reviewEvents(event, false);
    });
    this.deletedEventUserSubscription$ = this._serviceProfile.deletedEvent$.subscribe(event => {
      this.reviewEvents(event, true);
    });
  }
  
  subscribeModalConfirm() {
    this.modalSubscription$ = this.notification.modalConfirm$.subscribe((confirm:Modal) => {
      if(confirm.id===this.idModal && confirm.confirm) {
        this.spinner.show();

        this._service.leave(this.eventSelected).subscribe(
          (resp:any) => {
            if(resp.success) {
              this.reviewEvents(resp.events[0], true);
              this._serviceProfile.deletedEvent$.next(resp.events[0]);
            }

            this.notification.alertNotification({message: resp.message, type: resp.success ? TypeAlertNotification.SUCCESS: TypeAlertNotification.ERROR});
          }
        );
        this.spinner.hidde();
      }
    });
  }

  completeEvents() {
    this._service.eventsData()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.events$.next(resp.events);
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );
  }

  onParticipateEvent(event:EventDayDto) {
    this.spinner.show();

    this._service.participate(event)
      .subscribe(
        (resp:any) => {
          this.notification.alertNotification({
            message: resp.message,
            type: resp.success
              ? TypeAlertNotification.SUCCESS
              : TypeAlertNotification.ERROR
            });

          if(resp.success && !!resp.insignia) {
            this.insignia.show(InsigniaType.DYNAMIC);
            const { name, image } = resp.insignia;
            this._serviceProfile.userInsignias$.next([{name, image, complete:true}]);
          }
          
          this._serviceProfile.addedEvent$.next(event);
          this.reviewEvents(event);
          this.spinner.hidde();
        }
      );
  }

  reviewEvents(event:EventDayDto, leave:boolean=false) {
    let newData:EventDayDto;
    let newEvents:EventDayDto[] = [];
    for(let i=0; i<this.events.length; i++) {
      if(this.events[i].id===event.id) {
        newData = {
          ...this.events[i],
          participating : true,
          date_aborted: leave ? new Date() : null
        };
        newEvents.push(newData);
      } else {
        newEvents.push(this.events[i]);
      }
    }
    
    this.events$.next(newEvents);
  }

  onLeaveEvent(event:EventDayDto) {
    this.eventSelected = event;
    this.idModal = this.notification.modal({
      title:'Abandonar Evento',
      message:'¿Estás seguro de que deseas abandonar el evento?',
    });
  }

}
