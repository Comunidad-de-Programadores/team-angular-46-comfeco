import { Component, ViewEncapsulation } from '@angular/core';

import { InsigniaService } from './insignia.service';

@Component({
  selector: 'comfeco-insignia',
  templateUrl: './insignia.component.html',
  styleUrls: ['./insignia.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class InsigniaComponent {

  constructor(public service:InsigniaService) { }

}
