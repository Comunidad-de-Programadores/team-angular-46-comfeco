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
    this.openWindow('https://twitter.com/comfeco');
  }

  facebook() {
    this.openWindow('https://www.facebook.com/groups/2637132626546045');
  }

  discord() {
    this.openWindow('https://discord.com/invite/5Bb5yvzNPr');
  }

  youtube() {
    this.openWindow('https://www.youtube.com/channel/UC0oi8uH1vxDcyt7b_3iByew');
  }

  github() {
    this.openWindow('https://github.com/Comunidad-de-Programadores');
  }

  openWindow(url:string) {
    ComponentConfeco.goToLink(url);
  }

}
