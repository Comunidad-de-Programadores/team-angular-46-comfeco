import { NgModule } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@NgModule({
  providers: [
    AuthService,
    TokenService
  ]
})
export class ServicesModule { }
