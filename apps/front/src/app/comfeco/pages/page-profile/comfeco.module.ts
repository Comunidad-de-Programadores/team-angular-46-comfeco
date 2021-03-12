import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComfecoProfileRoutingModule, Components } from './comfeco-routing.module';
import { ThemeComfecoModule } from '../../@theme/theme.module';

@NgModule({
  declarations: [
    ...Components
  ],
  providers: [],
  imports: [
    CommonModule,
    ComfecoProfileRoutingModule,
    ThemeComfecoModule
  ]
})
export class ComfecoProfileModule { }
