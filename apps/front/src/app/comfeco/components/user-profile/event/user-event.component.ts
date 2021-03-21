import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { EventDayDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-user-event',
  templateUrl: './user-event.component.html',
  styleUrls: ['./user-event.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEventComponent {

  @Input() event:EventDayDto;
  @Output() onLeaveEvent: EventEmitter<EventDayDto> = new EventEmitter<EventDayDto>();

  leave() {
    this.onLeaveEvent.emit( this.event );
  }

}
