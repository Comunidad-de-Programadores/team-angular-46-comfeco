import { Component, ViewEncapsulation } from '@angular/core';

import { ComponentConfeco } from '../../../@core/utils.component';

@Component({
  selector: 'comfeco-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FooterComponent {

  twitter() {
    ComponentConfeco.goToLink('https://twitter.com/comfeco');
  }

  facebook() {
    ComponentConfeco.goToLink('https://www.facebook.com/groups/2637132626546045');
  }

  discord() {
    ComponentConfeco.goToLink('https://discord.com/invite/5Bb5yvzNPr');
  }

  youtube() {
    ComponentConfeco.goToLink('https://www.youtube.com/channel/UC0oi8uH1vxDcyt7b_3iByew');
  }

  github() {
    ComponentConfeco.goToLink('https://github.com/Comunidad-de-Programadores');
  }

  patreon() {
    ComponentConfeco.goToLink('https://www.patreon.com/comfeco');
  }

}
