import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { UserGroupDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-card-mygroup',
  templateUrl: './card-my-group.component.html',
  styleUrls: ['./card-my-group.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardMyGroupComponent {

  @Input() group:UserGroupDto;
  @Input() error:string;
  @Output() onLeaveGroup: EventEmitter<boolean> = new EventEmitter();

  onLeave() {
    this.onLeaveGroup.emit(true);
  }
  
}
