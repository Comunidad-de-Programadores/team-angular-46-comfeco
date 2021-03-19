import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { SpinnerService } from '@comfeco/api';
import { AreaWorkshopDto } from '@comfeco/interfaces';

import { Subscription } from 'rxjs';
import { WorkshopsService } from '../../@core/services/workshops.service';
import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';

@Component({
  selector: 'comfeco-page-workshops',
  templateUrl: './page-workshops.component.html',
  styleUrls: ['./page-workshops.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageWorkshopsComponent implements OnInit, OnDestroy {

  workshopsArea:AreaWorkshopDto[] = [];
  
  messageErrorWorkshops:string;

  workshopsSubscription$:Subscription;

  constructor(
    private _workshopsService: WorkshopsService,
    private notification: LayoutComfecoService,
    private spinner: SpinnerService
  ) {}
  
  ngOnInit(): void {
    this.completeWorkshops();
  }

  ngOnDestroy(): void {
    this.workshopsSubscription$?.unsubscribe();
  }

  completeWorkshops() {
    this.spinner.show();
    this.workshopsSubscription$ = this._workshopsService.workshops()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.areas) {
              this.workshopsArea = resp.areas;
            }
          } else {
            this.messageErrorWorkshops = resp.message;
          }
          this.spinner.hidde();
        }
      );
  }

  onWorkshopNotAvailable(message:string) {
    this.notification.alertNotification({message});
  }

  onSocialNetworkNotAvailable(message:string) {
    this.notification.alertNotification({message});
  }

}
