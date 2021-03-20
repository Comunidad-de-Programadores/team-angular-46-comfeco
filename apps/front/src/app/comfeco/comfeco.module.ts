import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from "swiper/angular";

import { ThemeComfecoModule } from './@theme/theme.module';
@NgModule({
  declarations: [
    ...PipesComponents,
    ...Components,
    ...PageComponents
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
