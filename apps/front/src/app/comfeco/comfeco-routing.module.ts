import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComfecoComponent } from './comfeco.component';
import { ArticleContainerComponent } from './pages/article-container/article-container.component';
import { CardCommunityComponent } from './pages/card-community/card-community.component';
import { CardCreatorComponent } from './pages/card-creator/card-creator.component';
import { CardWorkshopComponent } from './pages/card-workshop/card-workshop.component';
import { ComboComponent } from './pages/combo/combo.component';
import { CommunityComponent } from './pages/community/community.component';
import { CounterdownComponent } from './pages/counterdown/counterdown.component';
import { ExhibitorComponent } from './pages/exhibitor/exhibitor.component';
import { PageCommunitiesComponent } from './pages/page-communities/page-communities.component';
import { PageCreatorsComponent } from './pages/page-creators/page-creators.component';
import { PageDashboardComponent } from './pages/page-dashboard/page-dashboard.component';
import { PageWorkshopsComponent } from './pages/page-workshops/page-workshops.component';
import { SliderComponent } from './pages/slider/slider.component';
import { SponsorComponent } from './pages/sponsor/sponsor.component';
import { WorkshopListComponent } from './pages/workshop-list/workshop-list.component';
import { WorkshopComponent } from './pages/workshop/workshop.component';

export const Components = [
  ComfecoComponent,
  ComboComponent,
  
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
];

const routes: Routes = [
  { path: '', component: ComfecoComponent, children: [
      { path: 'dashboard', component: PageDashboardComponent }, // app/dashboard
      { path: 'communities', component: PageCommunitiesComponent }, // app/communities
      { path: 'workshops', component: PageWorkshopsComponent }, // app/workshops
      { path: 'creators', component: PageCreatorsComponent }, // app/creators
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
