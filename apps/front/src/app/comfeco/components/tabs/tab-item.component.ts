import { Component, Input, ContentChild, } from '@angular/core';

import { TabBodyComponent } from './tab-body.component';

@Component({
  selector: 'app-tab-item',
  template: '<ng-content></ng-content>',
})
export class TabItemComponent {

  @Input() label: string;
  @Input() icon: string;
  @Input() id: string;
  @Input() clazz: string;

  @Input() isActive: boolean;

  @ContentChild(TabBodyComponent)
  bodyComponent: TabBodyComponent;

}
