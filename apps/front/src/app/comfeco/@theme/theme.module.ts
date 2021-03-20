import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { components } from './theme.components';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderService } from './@components/header/header.service';
import { ApiModule } from '@comfeco/api';

@NgModule({
  declarations: [
    ...components
  ],
  providers: [
    HeaderService,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ApiModule
  ],
  exports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ...components
  ],
})
export class ThemeComfecoModule { }
