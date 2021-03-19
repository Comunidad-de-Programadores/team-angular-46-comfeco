import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { WorkshopAreaDto } from '@comfeco/interfaces';

import { ComponentConfeco } from '../../@core/utils.component';

@Component({
  selector: 'comfeco-card-workshop',
  templateUrl: './card-workshop.component.html',
  styleUrls: ['./card-workshop.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardWorkshopComponent {

  @Input() workshop:WorkshopAreaDto;

  goToWorkshop() {
    if(this.workshop.urlWorkshop) {
      ComponentConfeco.goToLink(this.workshop.urlWorkshop);
    }
  }

  goToSocialNetwork() {
    if(this.workshop.urlSocialNetwork) {
      ComponentConfeco.goToLink(this.workshop.urlSocialNetwork);
    }
  }
  
}
