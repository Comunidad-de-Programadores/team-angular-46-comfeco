import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { UserDto } from '@comfeco/interfaces';
import { ComponentConfeco } from '../../@core/utils.component';
import { SocialNetworkInterface } from './social.interface';

@Component({
  selector: 'comfeco-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInformationComponent {
  
  @Input() user:UserDto;

  openSocial(link:string) {
    ComponentConfeco.goToLink(link);
  }

}
