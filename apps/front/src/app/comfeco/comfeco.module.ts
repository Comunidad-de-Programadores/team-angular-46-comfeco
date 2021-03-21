import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';

import { ThemeComfecoModule } from './@theme/theme.module';
import { LogoutService } from '../auth/@core/services/logout.service';

import { ComfecoRoutingModule, PageComponents } from './comfeco-routing.module';
import { PipesComponents } from './@core/pipes/pipes.index';
import { Components } from './components';

@NgModule({
  declarations: [
    ...PipesComponents,
    ...Components,
    ...PageComponents,
  ],
  providers: [
    LogoutService,
  ],
  imports: [
    CommonModule,
    ComfecoRoutingModule,
    ThemeComfecoModule,
    SwiperModule,
  ]
})
export class ComfecoModule { }
