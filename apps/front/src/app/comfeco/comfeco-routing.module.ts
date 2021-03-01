import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComfecoComponent } from './comfeco.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';

export const Components = [
  ComfecoComponent,
  PageDashboardComponent
];

const routes: Routes = [
  { path: '', component: ComfecoComponent, children: [
      { path: 'dashboard', component: PageDashboardComponent }, // app/dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComfecoRoutingModule { }
