import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { SpinnerService } from '@comfeco/api';

import { EventDayDto, InsigniaDto, RecentActivityDto, UserDto } from '@comfeco/interfaces';

import { TypeAlertNotification } from '../../@theme/@components/alert-notification/alert-notification.enum';
import { Modal } from '../../@theme/@components/modal/modal.interface';
import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';

import { PageProfileService } from '../page-profile/page-profile.service';
import { PageProfileUserService } from './page-profile-user.service';

@Component({
  selector: 'comfeco-page-profile-user',
  templateUrl: './page-profile-user.component.html',
  styleUrls: ['./page-profile-user.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageProfileUserComponent implements OnInit, OnDestroy {

  user:UserDto;
  events:EventDayDto[];
  insignias:InsigniaDto[];
  activities:RecentActivityDto[];
  idModal:number;

  eventSelected:EventDayDto;
  
  messageActivities:string;
  messageErrorEvents:string;
  
  modalSubscription$:Subscription;
  addedEventsSubscription$:Subscription;
  deletedEventsSubscription$:Subscription;
  userInformationSubscription$:Subscription;
  insigniasSubscription$:Subscription;

  constructor(
    private _serviceProfile: PageProfileService,
    private _service:PageProfileUserService,
    private notification: LayoutComfecoService,
    private spinner: SpinnerService,
  ) {}

  ngOnInit(): void {
    this.subscriptionUserInformation();
    this.subscriptionInsignias();
    this.subscriptionEvents();

    this.completeUserInformation();
    this.completeAllInsignias();
    this.completeRecentActivity();
    this.completeUserEvents();
    this.subscribeModalConfirm();
  }

  ngOnDestroy() {
    this.modalSubscription$.unsubscribe();
    this.addedEventsSubscription$.unsubscribe();
    this.deletedEventsSubscription$.unsubscribe();
    this.userInformationSubscription$.unsubscribe();
    this.insigniasSubscription$.unsubscribe();
  }

  subscriptionUserInformation() {
    this.spinner.show();
    this.userInformationSubscription$ = this._serviceProfile.userInformation$.subscribe(userChanged => {
      this.user = userChanged;
      this.spinner.hidde();
    });
  }

  subscriptionInsignias() {
    this.spinner.show();
    this.insigniasSubscription$ = this._serviceProfile.userInsignias$.subscribe(insigniasChanged => {
      if(!!this.insignias) {
        let newInsignias:InsigniaDto[] = [];
        for(let i=0; i<this.insignias.length; i++) {
          if(this.insignias[i].name===insigniasChanged[0].name) {
            newInsignias.push({
              ...this.insignias[i],
              complete: true
            });
          } else {
            newInsignias.push(this.insignias[i]);
          }
        }
        this.insignias = newInsignias;
      } else {
        this.insignias = insigniasChanged;
      }
      this.spinner.hidde();
    });
  }

  subscriptionEvents() {
    this.addedEventsSubscription$ = this._serviceProfile.addedEvent$.subscribe(eventsChanged => {
      this.spinner.show();
      if(!this.events) {
        this.events = [];
      }
      
      this.events = [ ...this.events, eventsChanged ];
      this.completeRecentActivity();
      this.spinner.hidde();
    });
    
    this.deletedEventsSubscription$ = this._serviceProfile.deletedEvent$.subscribe(eventsChanged => {
      this.spinner.show();
      let newEvents:EventDayDto[] = [];
      for(let i=0; i<this.events.length; i++) {
        if(this.events[i].id!==eventsChanged.id) {
          newEvents.push(this.events[i]);
        }
      }

      if(newEvents.length==0) {
        this.messageErrorEvents = 'No te has inscrito en ningún evento';
      }

      this.events = newEvents;
      this.completeRecentActivity();
      this.spinner.hidde();
    });
  }

  completeUserInformation() {
    this.spinner.show();
    this._serviceProfile.userInformation()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this._serviceProfile.userInformation$.next(resp);
          } else {
            this.notification.alertNotification({message: resp.message});
          }
          this.spinner.hidde();
        }
      );
  }

  completeAllInsignias() {
    this.spinner.show();
    this._service.allInsignias()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.processingInsignias(resp.insignias);
          } else {
            this.notification.alertNotification({message: resp.message});
          }
          this.spinner.hidde();
        }
      );
  }

  completeRecentActivity() {
    this.spinner.show();
    this._service.recentActivity()
      .subscribe(
        (resp:any) => {
          this.activities = resp.success ? resp.activities : [];

          if(!resp.success) {
            this.messageActivities = resp.message;
          }

          this.spinner.hidde();
        }
      );
  }

  completeUserEvents() {
    this.spinner.show();
    this._service.userEvents()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.events = resp.events;
          } else {
            this.messageErrorEvents = resp.message;
          }
          this.spinner.hidde();
        }
      );
  }

  subscribeModalConfirm() {
    this.modalSubscription$ = this.notification.modalConfirm$.subscribe((confirm:Modal) => {
      if(confirm.id===this.idModal && confirm.confirm) {
        this.spinner.show();

        this._service.leave(this.eventSelected).subscribe(
          (resp:any) => {
            if(resp.success) {
              this._serviceProfile.deletedEvent$.next(resp.events[0]);
            }

            this.notification.alertNotification({message: resp.message, type: resp.success ? TypeAlertNotification.SUCCESS: TypeAlertNotification.ERROR});
            this.spinner.hidde();
          }
        );
      }
    });
  }

  processingInsignias(insignias:InsigniaDto[]) {
    if(!!insignias) {
      let insigniasUser:InsigniaDto[] = [];

      this._service.userInsignias()
        .subscribe(
          (resp:any) => {
            if(resp.success) {
              const nameInsigniasUser:string[] = [];

              resp.insignias.forEach((insignia:InsigniaDto) => {
                nameInsigniasUser.push(insignia.name);
              });

              insignias.forEach((insignia:InsigniaDto)=> {
                const { name, image } = insignia;

                insigniasUser.push({
                  name, image,
                  complete: nameInsigniasUser.includes(insignia.name)
                });
              });
              
              this._serviceProfile.userInsignias$.next(insigniasUser);
            } else {
              this.notification.alertNotification({message: resp.message});
            }
          }
        );
    }
  }

  onLeaveEvent(event:EventDayDto) {
    this.eventSelected = event;
    this.idModal = this.notification.modal({
      title:'Abandonar Evento',
      message:'¿Estás seguro de que deseas abandonar el evento?',
    });
  }

  onEditProfileEvent(edit:boolean) {
    if(edit) {
      this.spinner.show();
      let editRef:HTMLElement = document.getElementById('editProfile') as HTMLElement;
      editRef.click();
      const newUser:UserDto = {
        ...this.user
      }
      this._serviceProfile.userInformation$.next(newUser);
      this.spinner.hidde();
    }
  }
  
}
