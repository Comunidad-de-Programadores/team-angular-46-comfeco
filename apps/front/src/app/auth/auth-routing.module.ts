import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginUserComponent } from './pages/login-user/login-user.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { RegisterUserComponent } from './pages/register-user/register-user.component';
import { SetPasswordComponent } from './pages/set-password/set-password.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';

/** Componentes a registrar dentro del Modulo de Login */
export const Components = [
  /** Vista principal donde se almacena el template de la aplicación */
  AuthComponent,

  /** Paginas estaticas para visualizacion de las politicas y terminos */
  TermsAndConditionsComponent,
  PrivacyPolicyComponent,
  
  /** Vistas auxiliares dentro de las vistas de rutas */
  LoginUserComponent,
  RegisterUserComponent,

  /** Vistas de la aplicación para el Login */
  LoginUserComponent,
  RecoveryPasswordComponent,
  SetPasswordComponent,
];

/** Rutas del Modulo de Login */
const routes: Routes = [
  { path: '', component: AuthComponent, children: [
      { path: 'login', component: LoginUserComponent }, // auth/login
      { path: 'register', component: RegisterUserComponent}, // auth/register
      { path: 'recoverypassword', component: RecoveryPasswordComponent  }, // auth/recoverypassword
      { path: 'setpassword/:token', component: SetPasswordComponent }, // auth/setpassword/{token-recovery}
      { path: 'terms-and-conditions', component: TermsAndConditionsComponent }, // auth/terms-and-conditions
      { path: 'privacy-policy', component: PrivacyPolicyComponent }, // auth/privacy-policy
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
