import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { LoginUserComponent } from './pages/login-user/login-user.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { RegisterUserComponent } from './pages/register-user/register-user.component';
import { SetPasswordComponent } from './pages/set-password/set-password.component';
import { ViewLoginComponent } from './pages/view-login/view-login.component';

/** Componentes a registrar dentro del Modulo de Login */
export const Components = [
  /** Vista principal donde se almacena el template de la aplicación */
  LoginComponent,

  /** Vistas auxiliares dentro de las vistas de rutas */
  LoginUserComponent,
  RegisterUserComponent,

  /** Vistas de la aplicación para el Login */
  ViewLoginComponent,
  RecoveryPasswordComponent,
  SetPasswordComponent,
];

/** Rutas del Modulo de Login */
const routes: Routes = [
  { path: '', component: LoginComponent, children: [
      { path: 'login', component: ViewLoginComponent }, // login/login
      { path: 'recoverypassword', component: RecoveryPasswordComponent  }, // login/recoverypassword
      { path: 'setpassword/:token', component: SetPasswordComponent }, // // login/setpassword
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
