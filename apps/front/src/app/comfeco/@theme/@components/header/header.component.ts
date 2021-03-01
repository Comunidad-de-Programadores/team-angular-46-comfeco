import { Component, ViewEncapsulation, OnInit, ElementRef } from '@angular/core';

import { MenuDto } from '@comfeco/interfaces';

import { HeaderService } from './header.service';

@Component({
  selector: 'comfeco-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
  encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent implements OnInit {

  showMenu = false;
  showProfileOptions = false;

  options:MenuDto[] = [];
  user:string;
  photoUrl:string;

  constructor(
    private _service: HeaderService,
    private _domref: ElementRef) { }

  onClickOutside(event) {
    if (!this._domref.nativeElement.contains(event.target)) {
      this.showProfileOptions = false;
    }
  }

  ngOnInit(): void {
    this._service.optionsMenu()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.options = resp.options;
          } else {
            console.log(resp.message);
          }
        }
      );
    
    this._service.user()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            const { user, photoUrl } = resp;
            this.user = user;
            this.photoUrl = photoUrl;
          } else {
            console.log(resp.message);
          }
        }
      );
  }
  
  toggleProfileOptions() {
    this.showProfileOptions = !this.showProfileOptions;
  }

  toggleMenu(showMenu:boolean) {
    this.showMenu = showMenu;
  }

}
