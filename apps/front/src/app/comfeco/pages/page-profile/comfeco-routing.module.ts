import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgeUserPipe } from '../../@core/pipes/age-user.pipe';
import { SocialNetworkPipe } from '../../@core/pipes/social-network.pipe';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { PageProfileUserComponent } from '../page-profile-user/page-profile-user.component';
import { UserEventComponent } from '../user-event/user-event.component';
import { UserEventsComponent } from '../user-events/user-events.component';
import { UserInformationComponent } from '../user-information/user-information.component';
import { UserInsigniasComponent } from '../user-insignias/user-insignias.component';
import { UserRecentActivityComponent } from '../user-recent-activity/user-recent-activity.component';
import { PageProfileComponent } from './page-profile.component';

export const Components = [
  PageProfileComponent,
  
  SocialNetworkPipe,
  AgeUserPipe,
  
  UserEventComponent,
  UserEventsComponent,
  UserInformationComponent,
  UserInsigniasComponent,
  UserRecentActivityComponent,

  PageProfileUserComponent,
  EditProfileComponent,
];

const routes: Routes = [
  { path: '', component: PageProfileComponent, children: [
      { path: '', component: PageProfileUserComponent }, // app/my-profile
      { path: 'edit', component: EditProfileComponent }, // app/my-profile/edit
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComfecoProfileRoutingModule { }
