import { Component, ViewEncapsulation, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MenuDto } from '@comfeco/interfaces';

import { LayoutComfecoService } from '../../layout/layout-comfeco.service';
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
export class HeaderComponent implements OnInit, OnDestroy {

  photoDefault:string = 'assets/img/avatar_user.svg';
  photoUrl:string;

  showMenu = false;
  showProfileOptions = false;

  options:MenuDto[] = [];

  private photoUrlRef$:Subscription = null;

  constructor(
    private _router: Router,
    private _domref: ElementRef,
    public service: HeaderService,
    private notification: LayoutComfecoService,
  ) {}

  onClickOutside(event) {
    if (!this._domref.nativeElement.contains(event.target)) {
      this.showProfileOptions = false;
    }
  }

  ngOnInit(): void {
    this.photoUrl = this.photoDefault;
    this.photoUrlRef$ = this.service.photoUrl$.subscribe(resp => {
      const photoRef:any = document.getElementById("user-photo-profile");
      const photoNew:string = !!resp ? resp : this.photoDefault;
      photoRef.setAttribute('src', photoNew);
      this.photoUrl = photoNew;
    });

    this.service.optionsMenu()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            this.options = resp.options;
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );

    this.service.user()
      .subscribe(
        (resp:any) => {
          if(resp.success) {
            const { user, photoUrl } = resp;
            this.service.changeUser(user);
            this.service.changePhoto(photoUrl);
          } else {
            this.notification.alertNotification({message: resp.message});
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.photoUrlRef$.unsubscribe();
  }

  toggleProfileOptions() {
    this.showProfileOptions = !this.showProfileOptions;
  }

  toggleMenu(showMenu:boolean) {
    this.showMenu = showMenu;
  }

  logout() {
    this.service.logout().subscribe(resp =>{
      if(resp.success){
        localStorage.clear();
        this._router.navigate(['/login/login']);
      }
    });
    this.toggleProfileOptions();
  }

  myProfile() {
    this._router.navigateByUrl('/app/my-profile');
    this.toggleProfileOptions();
  }

}
