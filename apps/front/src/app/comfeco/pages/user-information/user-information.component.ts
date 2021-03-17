import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { UserDto } from '@comfeco/interfaces';

import { ComponentConfeco } from '../../@core/utils.component';

@Component({
  selector: 'comfeco-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInformationComponent {
  
  @Input() user:UserDto;
  @Output() onEditProfileEvent: EventEmitter<boolean> = new EventEmitter();

  openSocial(link:string) {
    ComponentConfeco.goToLink(link);
  }

  editInformation() {
    this.onEditProfileEvent.emit(true);
  }

}
