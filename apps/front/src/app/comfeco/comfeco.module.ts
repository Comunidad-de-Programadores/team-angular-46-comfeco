import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from "swiper/angular";

import { ComfecoRoutingModule, Components } from './comfeco-routing.module';
import { ThemeComfecoModule } from './@theme/theme.module';
import { LogoutService } from '../auth/@core/services/logout.service';

@NgModule({
  declarations: [
    ...Components
  ],
  providers: [
    LogoutService,
  ],
  imports: [
    CommonModule,
    ComfecoRoutingModule,
    ThemeComfecoModule,
    SwiperModule
  ]
})
export class ComfecoModule { }
