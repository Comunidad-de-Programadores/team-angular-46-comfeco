import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComfecoRoutingModule, Components } from './comfeco-routing.module';
import { ThemeComfecoModule } from './@theme/theme.module';
import { DashboardService } from './pages/page-dashboard/page-dashboard.service';
import { SwiperModule } from 'swiper/angular';
@NgModule({
  declarations: [
    ...Components
  ],
  providers: [
    DashboardService,
  ],
  imports: [
    CommonModule,
    ComfecoRoutingModule,
    ThemeComfecoModule,
    SwiperModule
  ]
})
export class ComfecoModule { }
