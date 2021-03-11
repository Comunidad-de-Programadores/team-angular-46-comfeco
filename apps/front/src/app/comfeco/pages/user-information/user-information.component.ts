import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDto } from '@comfeco/interfaces';
import { SocialNetworkInterface } from './social.interface';

@Component({
  selector: 'comfeco-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInformationComponent implements OnInit {
  
  @Input() user:UserDto;

  specialities:string;
  country:string;
  socialNetworks:SocialNetworkInterface[];

  ngOnInit(): void {
    this.specialities = !!this.user?.specialities ? this.user.specialities.join(' / ') : '';
    this.country = '';
    
    if(!!this.user?.country?.name) {
      this.country = (!!this.user?.birdth_date ? '- ' : '') + this.user.country.name;
    }

    if(!!this.user?.social_networks) {
      if(this.user?.social_networks.facebook) {
        this.socialNetworks.push({ name: 'facebook', clases: 'icon-comfeco-facebook', link: this.user?.social_networks.facebook });
      }

      if(this.user?.social_networks.facebook) {
        this.socialNetworks.push({ name: 'github', clases: 'icon-comfeco-github', link: this.user?.social_networks.github });
      }

      if(this.user?.social_networks.facebook) {
        this.socialNetworks.push({ name: 'twitter', clases: 'icon-comfeco-twitter', link: this.user?.social_networks.twitter });
      }

      if(this.user?.social_networks.facebook) {
        this.socialNetworks.push({ name: 'linkedin', clases: 'icon-comfeco-linkedin', link: this.user?.social_networks.linkedin });
      }
    }
  }
  
}
