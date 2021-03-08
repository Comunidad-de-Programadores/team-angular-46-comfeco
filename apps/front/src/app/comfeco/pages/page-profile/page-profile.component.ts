import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuOptionUserProfileDto } from '@comfeco/interfaces';
import { PageProfileService } from './page-profile.service';

@Component({
  selector: 'comfeco-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageProfileComponent implements OnInit {

  options:MenuOptionUserProfileDto[] = [];

  constructor(private _service: PageProfileService) { }

  ngOnInit(): void {
    this._service.optionsMenu()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.options = resp.options;
          } else {
            console.log(resp.message);
          }
        }
      );
  }

}
