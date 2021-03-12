import { Component, Input, ViewEncapsulation } from '@angular/core';
import { EventDayDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-user-event',
  templateUrl: './user-event.component.html',
  styleUrls: ['./user-event.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UserEventComponent {

  @Input() event:EventDayDto;

}
