import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// import * as guards from './@core/guards';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  { path: '**', redirectTo: 'login' },
];

/** Configura Angular pueda aceptar el signo # en el path */
const config: ExtraOptions = {
    useHash: false,
    initialNavigation: 'enabled',
    relativeLinkResolution: 'legacy'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
