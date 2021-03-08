import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkshopAreaDto } from '@comfeco/interfaces';
import { ComponentConfeco } from '../../@core/utils.component';

@Component({
  selector: 'comfeco-card-workshop',
  templateUrl: './card-workshop.component.html',
  styleUrls: ['./card-workshop.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardWorkshopComponent implements OnInit {

  @Input() workshop:WorkshopAreaDto;

  constructor() { }

  ngOnInit(): void {}

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
