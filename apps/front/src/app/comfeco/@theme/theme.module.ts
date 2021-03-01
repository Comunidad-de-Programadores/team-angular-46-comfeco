import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { components } from './theme.components';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ...components
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
