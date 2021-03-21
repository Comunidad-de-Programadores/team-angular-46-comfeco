import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { ExhibitorDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-card-creator',
  templateUrl: './card-creator.component.html',
  styleUrls: ['./card-creator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCreatorComponent {
  @Input() creator:ExhibitorDto;
}
