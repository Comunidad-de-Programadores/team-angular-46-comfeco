import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { components } from './theme-components';
import { ApiModule } from '@comfeco/api';

@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ApiModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ...components,
  ],
})
export class ThemeAuthModule { }
