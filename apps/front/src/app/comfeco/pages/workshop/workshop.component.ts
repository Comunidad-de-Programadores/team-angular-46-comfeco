import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { WorkshopAreaDto } from '@comfeco/interfaces';
import { ComponentConfeco } from '../../@core/utils.component';

@Component({
  selector: 'comfeco-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopComponent {

  @Input() workshop:WorkshopAreaDto;

  constructor() { }

  goToWorkshop() {
    ComponentConfeco.goToLink(this.workshop.urlWorkshop);
  }

  goToSocialNetwork() {
    ComponentConfeco.goToLink(this.workshop.urlSocialNetwork);
  }

}
