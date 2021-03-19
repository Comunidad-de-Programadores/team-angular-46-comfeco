import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { SpinnerService } from '@comfeco/api';
import { CommunityDto } from '@comfeco/interfaces';

import { CommunitiesService } from '../../@core/services/communities.service';

@Component({
  selector: 'comfeco-page-communities',
  templateUrl: './page-communities.component.html',
  styleUrls: ['./page-communities.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageCommunitiesComponent implements OnInit, OnDestroy {

  communities:CommunityDto[];
  
  messageErrorCommunities:string;

  communitiesSubscription$:Subscription;
  
  constructor(
    private _serviceCommunities: CommunitiesService,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.completeCommunities();
  }
  
  ngOnDestroy(): void {
    this.communitiesSubscription$?.unsubscribe();
  }

  completeCommunities() {
    this.spinner.show();
    this.communitiesSubscription$ = this._serviceCommunities.allCommunities()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            if(resp.communities) {
              this.communities = resp.communities;
            }
          } else {
            this.messageErrorCommunities = resp.message;
          }
          this.spinner.hidde();
        }
      );
  }

}
