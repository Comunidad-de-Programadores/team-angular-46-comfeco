import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { SponsorDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-card-sponsor',
  templateUrl: './card-sponsor.component.html',
  styleUrls: ['./card-sponsor.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSponsorComponent {

  @Input() sponsor:SponsorDto;

}
