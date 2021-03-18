import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { Components, AuthRoutingModule } from './auth-routing.module';
import { ThemeAuthModule } from './@theme/theme-auth.module';
import { ServicesModule } from './@core/service.module';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    ...Components,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ThemeAuthModule,
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
export class AuthModule { }
