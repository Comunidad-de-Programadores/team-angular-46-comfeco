import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { MenuDto } from '@comfeco/interfaces';

@Component({
  selector: 'comfeco-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MenuMobileComponent implements OnInit {

  @Input() showMenu:boolean;
  @Input() options:MenuDto[];
  
  constructor() { }

  ngOnInit(): void {
  }

}
