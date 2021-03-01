import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComfecoRoutingModule, Components } from './comfeco-routing.module';
import { ThemeComfecoModule } from './@theme/theme.module';

@NgModule({
  declarations: [
    ...Components
  ],
  imports: [
    CommonModule,
    ComfecoRoutingModule,
    ThemeComfecoModule
  ]
})
export class ComfecoModule { }
