import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { GroupDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-card-group',
  templateUrl: './card-group.component.html',
  styleUrls: ['./card-group.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGroupComponent {

  @Input() group:GroupDto;

  @Output() onJoinGroup: EventEmitter<GroupDto> = new EventEmitter<GroupDto>();
  @Output() onLeaveGroup: EventEmitter<GroupDto> = new EventEmitter<GroupDto>();

  onJoin() {
    this.onJoinGroup.emit(this.group);
  }

  onLeave() {
    this.onLeaveGroup.emit(this.group);
  }

}
