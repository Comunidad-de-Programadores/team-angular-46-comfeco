import { Component, ViewEncapsulation } from '@angular/core';

import { ComponentConfeco } from '../../../../comfeco/@core/utils.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'comfeco-auth-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FooterComponent {
  
  twitter() {
    ComponentConfeco.goToLink(environment.communityTwitter);
  }

  facebook() {
    ComponentConfeco.goToLink(environment.communityFacebook);
  }

  discord() {
    ComponentConfeco.goToLink(environment.communityDiscord);
  }

  youtube() {
    ComponentConfeco.goToLink(environment.communityYoutube);
  }

  github() {
    ComponentConfeco.goToLink(environment.communityGithub);
  }

  patreon() {
    ComponentConfeco.goToLink(environment.communityPatreon);
  }

}
