import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { InsigniaDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-user-insignias',
  templateUrl: './user-insignias.component.html',
  styleUrls: ['./user-insignias.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInsigniasComponent {

  @Input() insignias:InsigniaDto[];

}
