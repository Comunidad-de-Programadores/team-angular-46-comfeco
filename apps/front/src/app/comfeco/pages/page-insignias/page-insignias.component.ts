import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { InsigniaDto } from '@comfeco/interfaces';

import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';
import { PageInsigniasService } from './page-insignias.service';

@Component({
  selector: 'comfeco-page-insignias',
  templateUrl: './page-insignias.component.html',
  styleUrls: ['./page-insignias.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageInsigniasComponent implements OnInit {

  insignias:InsigniaDto[];
  
  constructor(
    private _service: PageInsigniasService,
    private notification: LayoutComfecoService
  ) {}

  ngOnInit(): void {
    this._service.insignias()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.insignias = resp.insignias;
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );
  }

}
