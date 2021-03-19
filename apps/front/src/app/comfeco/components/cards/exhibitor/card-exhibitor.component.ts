import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ExhibitorDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-card-exhibitor',
  templateUrl: './card-exhibitor.component.html',
  styleUrls: ['./card-exhibitor.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardExhibitorComponent {

  @Input() exhibitor:ExhibitorDto;

}
