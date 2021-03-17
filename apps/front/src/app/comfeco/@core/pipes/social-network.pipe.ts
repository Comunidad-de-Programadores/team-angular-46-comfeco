import { Pipe, PipeTransform } from '@angular/core';
import { UserSocialNetworksDto } from '@comfeco/interfaces';
import { SocialNetworkInterface } from '../../pages/user-information/social.interface';

@Pipe({
  name: 'socialNetworks'
})
export class SocialNetworkPipe implements PipeTransform {

  transform(value: UserSocialNetworksDto): SocialNetworkInterface[] {
    let socialNetworks:SocialNetworkInterface[];
    if(!!value) {
      socialNetworks = [];
      
      if(value.facebook) {
        socialNetworks.push({ name: 'facebook', clases: 'icon-comfeco-facebook', link: `https://facebook.com/${value.facebook}`});
      }

      if(value.github) {
        socialNetworks.push({ name: 'github', clases: 'icon-comfeco-github', link: `https://github.com/${value.github}` });
      }

      if(value.twitter) {
        socialNetworks.push({ name: 'twitter', clases: 'icon-comfeco-twitter', link: `https://twitter.com/${value.twitter}` });
      }

      if(value.linkedin) {
        socialNetworks.push({ name: 'linkedin', clases: 'icon-comfeco-linkedin', link: `https://linkedin.com/in/${value.linkedin}` });
      }
    }

    return socialNetworks;
  }

}
