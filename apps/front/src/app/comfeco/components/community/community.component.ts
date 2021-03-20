import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { ComponentConfeco } from '../../@core/utils.component';

@Component({
  selector: 'comfeco-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityComponent {

  @Input() image:string;
  @Input() community:string;
  @Input() link:string;

  goToLink() {
    ComponentConfeco.goToLink(this.link);
  }

}
