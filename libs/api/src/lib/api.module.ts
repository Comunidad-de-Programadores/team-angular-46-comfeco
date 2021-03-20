import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './spinner/spinner.service';

const components = [
  SpinnerComponent
];

const providers = [
  SpinnerService
];

@NgModule({
  declarations: [
    ...components
  ],
  providers: [
    ...providers
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ...components,
  ],
})
export class ApiModule {}
