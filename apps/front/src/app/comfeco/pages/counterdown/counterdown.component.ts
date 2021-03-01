import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { DayEvent } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-counterdown',
  templateUrl: './counterdown.component.html',
  styleUrls: ['./counterdown.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterdownComponent {

  @Input() dayEvent:DayEvent;
  
  constructor() { }

}
