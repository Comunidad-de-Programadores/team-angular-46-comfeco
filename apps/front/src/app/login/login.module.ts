import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { Components, LoginRoutingModule } from './login-routing.module';
import { ThemeLoginModule } from './@theme/theme-login.module';
import { ServicesModule } from './@core/service.module';
import { environment } from '../../environments/environment';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    ...Components,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ThemeLoginModule,
    ReactiveFormsModule,
    ServicesModule,
    SocialLoginModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleId
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              environment.facebookId
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ]
})
export class LoginModule { }
