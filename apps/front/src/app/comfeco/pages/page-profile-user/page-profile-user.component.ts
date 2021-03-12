import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EventDayDto, InsigniaDto, RecentActivityDto, UserDto } from '@comfeco/interfaces';
import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';
import { PageProfileUserService } from './page-profile-user.service';

@Component({
  selector: 'comfeco-page-profile-user',
  templateUrl: './page-profile-user.component.html',
  styleUrls: ['./page-profile-user.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageProfileUserComponent implements OnInit {

  user:UserDto;
  events:EventDayDto[];
  insignias:InsigniaDto[];
  activities:RecentActivityDto[];
  
  constructor(
    private _service:PageProfileUserService,
    private notification: LayoutComfecoService
  ) {}

  ngOnInit(): void {
    this._service.userInformation()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.user = resp;
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );
    
    this._service.allInsignias()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.processingInsignias(resp.insignias);
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );

    this._service.userEvents()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.events = resp.events;
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );
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
              
              this.insignias = insigniasUser;
            } else {
              this.notification.alertNotification({message: resp.message});
            }
          }
        );
    }
  }

}
