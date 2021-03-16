import { Component, OnInit, ViewEncapsulation } from '@angular/core';

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
  
  constructor(private _service: PageCommunitiesService) { }

  ngOnInit(): void {
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
        }
      );
  }

}
