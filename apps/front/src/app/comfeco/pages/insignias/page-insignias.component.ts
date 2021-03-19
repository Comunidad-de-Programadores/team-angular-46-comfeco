import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { InsigniaDto } from '@comfeco/interfaces';
import { SpinnerService } from '@comfeco/api';

import { InsigniasService } from '../../@core/services/insignias.service';
import { LayoutComfecoService } from '../../@theme/layout/layout-comfeco.service';

@Component({
  selector: 'comfeco-page-insignias',
  templateUrl: './page-insignias.component.html',
  styleUrls: ['./page-insignias.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PageInsigniasComponent implements OnInit, OnDestroy {

  insignias:InsigniaDto[];
  
  insigniasSubscription$:Subscription;

  constructor(
    private _service: InsigniasService,
    private notification: LayoutComfecoService,
    private spinner: SpinnerService,
  ) {}

  ngOnInit(): void {
    this.completeInsignias();
  }
  
  ngOnDestroy(): void {
    this.insigniasSubscription$?.unsubscribe();
  }

  completeInsignias() {
    this.spinner.show();
    this.insigniasSubscription$ = this._service.insignias()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.insignias = resp.insignias;
          } else {
            this.notification.alertNotification({message: resp.message});
          }
          this.spinner.hidde();
        }
      );
  }

}
