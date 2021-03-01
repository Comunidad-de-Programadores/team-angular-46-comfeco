import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { components } from './theme.components';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderService } from './@components/header/header.service';

@NgModule({
  declarations: [
    ...components
  ],
  providers: [
    HeaderService
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ...components
  ],
})
export class ThemeComfecoModule { }
