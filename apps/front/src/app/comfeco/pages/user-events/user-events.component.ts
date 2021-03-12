import { Component, Input, ViewEncapsulation } from '@angular/core';
import { EventDayDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UserEventsComponent {

  @Input() events:EventDayDto[];

}
