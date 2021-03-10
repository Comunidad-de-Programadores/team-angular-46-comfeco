import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuOptionUserProfileDto } from '@comfeco/interfaces';
import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';
import { PageProfileService } from './page-profile.service';

@Component({
  selector: 'comfeco-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageProfileComponent implements OnInit {

  options:MenuOptionUserProfileDto[] = [];

  constructor(
    private _service: PageProfileService,
    private notification: LayoutComfecoService
  ) {}

  ngOnInit(): void {
    this._service.optionsMenu()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.options = resp.options;
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );
  }

}
