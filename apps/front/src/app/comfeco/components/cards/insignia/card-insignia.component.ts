import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { InsigniaDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-card-insignia',
  templateUrl: './card-insignia.component.html',
  styleUrls: ['./card-insignia.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardInsigniaComponent {

  @Input() insignia:InsigniaDto;

}
