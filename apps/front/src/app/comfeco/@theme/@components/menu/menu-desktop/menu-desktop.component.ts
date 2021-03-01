import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MenuDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-menu-desktop',
  templateUrl: './menu-desktop.component.html',
  styleUrls: ['./menu-desktop.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MenuDesktopComponent implements OnInit {

  @Output() onShowMenu: EventEmitter<boolean> = new EventEmitter();
  @Input() options:MenuDto[];
  
  private showMenu:boolean = false;

  constructor() { }

  ngOnInit(): void {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.onShowMenu.emit( this.showMenu );
  }

}
