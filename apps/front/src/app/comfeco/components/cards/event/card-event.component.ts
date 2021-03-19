import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { EventDayDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-card-event',
  templateUrl: './card-event.component.html',
  styleUrls: ['./card-event.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardEventComponent {

  @Input() event:EventDayDto;
  @Output() onParticipateEvent: EventEmitter<EventDayDto> = new EventEmitter();
  @Output() onLeaveEvent: EventEmitter<EventDayDto> = new EventEmitter();

  participate() {
    this.onParticipateEvent.emit( this.event );
  }

  leave() {
    this.onLeaveEvent.emit( this.event );
  }

}
