import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { EventDayDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEventsComponent {

  @Input() events:EventDayDto[];
  @Input() message:string;
  @Output() onLeaveEvent: EventEmitter<EventDayDto> = new EventEmitter();
  
  viewEvents() {
    let eventsRef:HTMLElement = document.getElementById('events') as HTMLElement;
    eventsRef.click();
  }

  onLeave(event:EventDayDto) {
    this.onLeaveEvent.emit(event);
  }

}
