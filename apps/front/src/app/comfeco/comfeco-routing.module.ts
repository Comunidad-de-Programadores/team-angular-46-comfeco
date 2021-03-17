import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgeUserPipe } from './@core/pipes/age-user.pipe';
import { SocialNetworkPipe } from './@core/pipes/social-network.pipe';

import { ComfecoComponent } from './comfeco.component';
import { AuthGuard } from './guards/auth.guard';
import { ArticleContainerComponent } from './pages/article-container/article-container.component';
import { CardCommunityComponent } from './pages/card-community/card-community.component';
import { CardCreatorComponent } from './pages/card-creator/card-creator.component';
import { CardWorkshopComponent } from './pages/card-workshop/card-workshop.component';
import { ComboComponent } from './pages/combo/combo.component';
import { CommunityComponent } from './pages/community/community.component';
import { CounterdownComponent } from './pages/counterdown/counterdown.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ExhibitorComponent } from './pages/exhibitor/exhibitor.component';
import { PageCommunitiesComponent } from './pages/page-communities/page-communities.component';
import { PageCreatorsComponent } from './pages/page-creators/page-creators.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';
import { PageProfileUserComponent } from './pages/page-profile-user/page-profile-user.component';
import { PageProfileComponent } from './pages/page-profile/page-profile.component';
import { PageWorkshopsComponent } from './pages/page-workshops/page-workshops.component';
import { SliderComponent } from './pages/slider/slider.component';
import { SponsorComponent } from './pages/sponsor/sponsor.component';
import { TabBodyComponent } from './pages/tabs/tab-body.component';
import { TabItemComponent } from './pages/tabs/tab-item.component';
import { TabLabelComponent } from './pages/tabs/tab-label.component';
import { TabsComponent } from './pages/tabs/tabs.component';
import { UserEventComponent } from './pages/user-event/user-event.component';
import { UserEventsComponent } from './pages/user-events/user-events.component';
import { UserInformationComponent } from './pages/user-information/user-information.component';
import { UserInsigniasComponent } from './pages/user-insignias/user-insignias.component';
import { UserRecentActivityComponent } from './pages/user-recent-activity/user-recent-activity.component';
import { WorkshopListComponent } from './pages/workshop-list/workshop-list.component';
import { WorkshopComponent } from './pages/workshop/workshop.component';

export const Components = [
  ComfecoComponent,
  ComboComponent,

  TabBodyComponent,
  TabItemComponent,
  TabLabelComponent,
  TabsComponent,

  SocialNetworkPipe,
  AgeUserPipe,

  UserEventComponent,
  UserEventsComponent,
  UserInformationComponent,
  UserInsigniasComponent,
  UserRecentActivityComponent,
  PageProfileUserComponent,
  EditProfileComponent,

  CardCommunityComponent,
  CardWorkshopComponent,
  CardCreatorComponent,
  ArticleContainerComponent,
  CommunityComponent,
  CounterdownComponent,
  ExhibitorComponent,
  SliderComponent,
  SponsorComponent,
  WorkshopComponent,
  WorkshopListComponent,

  PageDashboardComponent,
  PageCommunitiesComponent,
  PageWorkshopsComponent,
  PageCreatorsComponent,
  PageProfileComponent,
];

const routes: Routes = [
  { path: '', component: ComfecoComponent,
   canActivate: [AuthGuard],
  children: [
      { path: 'dashboard', component: PageDashboardComponent }, // app/dashboard
      { path: 'communities', component: PageCommunitiesComponent }, // app/communities
      { path: 'workshops', component: PageWorkshopsComponent }, // app/workshops
      { path: 'creators', component: PageCreatorsComponent }, // app/creators
      { path: 'my-profile', component: PageProfileComponent }, // app/my-profile
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
