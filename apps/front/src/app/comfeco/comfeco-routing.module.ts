import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './@core/guards/auth.guard';

import { ComfecoComponent } from './comfeco.component';

import { PageCommunitiesComponent } from './pages/communities/page-communities.component';
import { PageCreatorsComponent } from './pages/creators/page-creators.component';
import { PageDashboardComponent } from './pages/dashboard/page-dashboard.component';
import { PageEditProfileComponent } from './pages/edit-profile/page-edit-profile.component';
import { PageEventsComponent } from './pages/events/page-events.component';
import { PageGroupsComponent } from './pages/groups/page-groups.component';
import { PageInsigniasComponent } from './pages/insignias/page-insignias.component';
import { PageProfileUserComponent } from './pages/profile-user/page-profile-user.component';
import { PageTabsProfileComponent } from './pages/tabs-profile/page-tabs-profile.component';
import { PageWorkshopsComponent } from './pages/workshops/page-workshops.component';

export const PageComponents = [
  ComfecoComponent,
  
  PageCommunitiesComponent,
  PageCreatorsComponent,
  PageDashboardComponent,
  PageEditProfileComponent,
  PageEventsComponent,
  PageGroupsComponent,
  PageInsigniasComponent,
  PageProfileUserComponent,
  PageTabsProfileComponent,
  PageWorkshopsComponent
];

const routes: Routes = [
  {
    path: '',
    component: ComfecoComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: PageDashboardComponent }, // app/dashboard
      { path: 'communities', component: PageCommunitiesComponent }, // app/communities
      { path: 'workshops', component: PageWorkshopsComponent }, // app/workshops
      { path: 'creators', component: PageCreatorsComponent }, // app/creators
      { path: 'my-profile', component: PageTabsProfileComponent }, // app/my-profile
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
