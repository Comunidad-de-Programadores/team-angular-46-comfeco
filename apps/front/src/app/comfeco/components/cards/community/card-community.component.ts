import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { ComponentConfeco } from '../../../@core/utils.component';

@Component({
  selector: 'comfeco-card-community',
  templateUrl: './card-community.component.html',
  styleUrls: ['./card-community.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCommunityComponent {

  @Input() image:string;
  @Input() community:string;
  @Input() link:string;
  
  goToLink() {
    ComponentConfeco.goToLink(this.link);
  }

}
