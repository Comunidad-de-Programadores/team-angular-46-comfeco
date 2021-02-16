import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Components, LoginRoutingModule } from './login-routing.module';
import { ThemeLoginModule } from './@theme/theme-login.module';

@NgModule({
  declarations: [
    ...Components,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ThemeLoginModule,
  ]
})
export class LoginModule { }
