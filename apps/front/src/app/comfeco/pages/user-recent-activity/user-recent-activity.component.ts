import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RecentActivityDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-user-recent-activity',
  templateUrl: './user-recent-activity.component.html',
  styleUrls: ['./user-recent-activity.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UserRecentActivityComponent {

  @Input() activities:RecentActivityDto[];

}
