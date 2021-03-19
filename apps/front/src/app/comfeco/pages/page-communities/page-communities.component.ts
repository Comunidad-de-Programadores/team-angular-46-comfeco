import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SpinnerService } from '@comfeco/api';

import { CommunityDto } from '@comfeco/interfaces';

import { PageCommunitiesService } from './page-communities.service';

@Component({
  selector: 'comfeco-page-communities',
  templateUrl: './page-communities.component.html',
  styleUrls: ['./page-communities.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageCommunitiesComponent implements OnInit {

  communities:CommunityDto[];
  
  messageErrorCommunities:string;
  
  constructor(
    private _service: PageCommunitiesService,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.completeCommunities();
  }

  completeCommunities() {
    this.spinner.show();
    this._service.communities()
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
