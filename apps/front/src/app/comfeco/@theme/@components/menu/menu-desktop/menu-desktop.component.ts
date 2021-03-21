import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { MenuDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-menu-desktop',
  templateUrl: './menu-desktop.component.html',
  styleUrls: ['./menu-desktop.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDesktopComponent {
  @Output() onShowMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() options:MenuDto[];

  private showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.onShowMenu.emit( this.showMenu );
  }

}
