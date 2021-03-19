import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { SpinnerService } from '@comfeco/api';
import { ExhibitorDto } from '@comfeco/interfaces';

import { ExhibitorsService } from '../../@core/services/exhibitors.service';

@Component({
  selector: 'comfeco-page-creators',
  templateUrl: './page-creators.component.html',
  styleUrls: ['./page-creators.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageCreatorsComponent implements OnInit, OnDestroy {

  creators:ExhibitorDto[] = [];
  
  messageErrorCreators:string;

  exhibitorsSubscription$:Subscription;

  constructor(
    private _exhibitorsService: ExhibitorsService,
    private spinner: SpinnerService
  ) {}
  
  ngOnInit(): void {
    this.completeExhibitors();
  }

  ngOnDestroy(): void {
    this.exhibitorsSubscription$?.unsubscribe();
  }
  
  completeExhibitors() {
    this.spinner.show();
    this.exhibitorsSubscription$ = this._exhibitorsService.exhibitors()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.exhibitors) {
              this.creators = resp.exhibitors;
            }
          } else {
            this.messageErrorCreators = resp.message;
          }
          this.spinner.hidde();
        }
      );
  }

}
