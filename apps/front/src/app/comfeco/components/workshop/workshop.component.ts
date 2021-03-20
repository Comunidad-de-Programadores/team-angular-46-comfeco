import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { WorkshopAreaDto } from '@comfeco/interfaces';

import { ComponentConfeco } from '../../@core/utils.component';

@Component({
  selector: 'comfeco-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkshopComponent {

  @Input() workshop:WorkshopAreaDto;

  @Output() onWorkshopNotAvailable: EventEmitter<string> = new EventEmitter();
  @Output() onSocialNetworkNotAvailable: EventEmitter<string> = new EventEmitter();
  
  goToWorkshop() {
    if(!!this.workshop?.urlWorkshop) {
      ComponentConfeco.goToLink(this.workshop.urlWorkshop);
    } else {
      this.onWorkshopNotAvailable.emit('La liga para el taller no se encuentra disponible en este momento');
    }
  }

  goToSocialNetwork() {
    if(!!this.workshop?.urlSocialNetwork) {
      ComponentConfeco.goToLink(this.workshop.urlSocialNetwork);
    } else {
      this.onSocialNetworkNotAvailable.emit('El perfil del expositor no se encuentra disponible');
    }
  }

}
