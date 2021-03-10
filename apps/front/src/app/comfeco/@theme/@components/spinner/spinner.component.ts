import { Component, ViewEncapsulation } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'comfeco-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SpinnerComponent {

  constructor(public service: SpinnerService) {}

}
